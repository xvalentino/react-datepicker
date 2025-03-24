import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setOpenState] = useState({ start: false, end: false });
  const endDateInputRef = useRef(null);
  const startDateInputRef = useRef(null);

  const handleDateChange = (date, inputType) => {
    if (!date) return;

    if (inputType === 'start') {
      setStartDate(date);
      // If end date exists and is before new start date, clear it
      if (endDate && endDate < date) {
        setEndDate(null);
      }
      // If end date is blank, focus and open end date picker
      if (!endDate) {
        // First close the start picker
        setOpenState({ start: false, end: false });
        // Then after a small delay, open the end picker
        setTimeout(() => {
          setOpenState({ start: false, end: true });
          endDateInputRef.current?.focus();
        }, 100);
      }
    } else if (inputType === 'end') {
      setEndDate(date);
      // If start date exists and is after new end date, clear it
      if (startDate && startDate > date) {
        setStartDate(null);
      }
      // If start date is blank, focus and open start date picker
      if (!startDate) {
        // First close the end picker
        setOpenState({ start: false, end: false });
        // Then after a small delay, open the start picker
        setTimeout(() => {
          setOpenState({ start: true, end: false });
          startDateInputRef.current?.focus();
        }, 100);
      }
    }
  };

  const getInputStyle = (inputType) => ({
    width: '200px',
    padding: '8px',
    border: `2px solid ${isOpen[inputType] ? '#007bff' : '#ced4da'}`,
    borderRadius: '4px',
    backgroundColor: isOpen[inputType] ? '#f8f9fa' : 'white',
    transition: 'all 0.2s ease',
    outline: 'none',
    cursor: 'pointer',
  });

  const toggleCalendar = (inputType) => {
    setOpenState(prev => ({
      ...prev,
      [inputType]: !prev[inputType]
    }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Smart Range Date Picker</h1>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px',
            color: isOpen.start ? '#007bff' : 'inherit',
            fontWeight: isOpen.start ? 'bold' : 'normal'
          }}>
            Start Date {isOpen.start && '•'}
          </label>
          <input
            ref={startDateInputRef}
            type="text"
            value={startDate ? startDate.toLocaleDateString() : ''}
            placeholder="Select start date"
            readOnly
            onClick={() => toggleCalendar('start')}
            style={getInputStyle('start')}
          />
          {isOpen.start && (
            <div style={{ position: 'absolute', zIndex: 1000 }}>
              <DatePicker
                selected={startDate}
                onChange={(date) => handleDateChange(date, 'start')}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="MM/dd/yyyy"
                open={isOpen.start}
                monthsShown={1}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                onClickOutside={() => toggleCalendar('start')}
                inline
              />
            </div>
          )}
        </div>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px',
            color: isOpen.end ? '#007bff' : 'inherit',
            fontWeight: isOpen.end ? 'bold' : 'normal'
          }}>
            End Date {isOpen.end && '•'}
          </label>
          <input
            ref={endDateInputRef}
            type="text"
            value={endDate ? endDate.toLocaleDateString() : ''}
            placeholder="Select end date"
            readOnly
            onClick={() => toggleCalendar('end')}
            style={getInputStyle('end')}
          />
          {isOpen.end && (
            <div style={{ position: 'absolute', zIndex: 1000 }}>
              <DatePicker
                selected={endDate}
                onChange={(date) => handleDateChange(date, 'end')}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="MM/dd/yyyy"
                open={isOpen.end}
                monthsShown={1}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                onClickOutside={() => toggleCalendar('end')}
                inline
              />
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <p>Selected Range: {getFormattedDateRange(startDate, endDate)}</p>
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          {getSelectionInstructions(startDate, endDate, isOpen)}
        </p>
      </div>
    </div>
  );
}

function getFormattedDateRange(startDate, endDate) {
  if (!startDate && !endDate) return "No dates selected";
  if (startDate && !endDate) return `From ${startDate.toLocaleDateString()}`;
  if (!startDate && endDate) return `Until ${endDate.toLocaleDateString()}`;
  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
}

function getSelectionInstructions(startDate, endDate, isOpen) {
  if (!startDate && !endDate) {
    return "Click either input to start selecting dates";
  }
  
  if (isOpen.end) {
    return "Select an end date. Click start date to modify start date.";
  }
  
  if (isOpen.start) {
    return "Select a start date. Click end date to modify end date.";
  }
  
  return "Click either input to modify the dates";
}

export default App;
