import "./BookCab.css";
import { useState, useEffect, useRef } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Select from "react-select";
import dayjs from "dayjs";

const BookCab = () => {
  const today = dayjs();
  const inputElement = useRef(null);
  const [timeValue, setTimeValue] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  const [sourceValue, setSourceValue] = useState(null);
  const [destinationValue, setDestinationValue] = useState(null);
  const [cabTypeValue, setCabTypeValue] = useState(null);
  const [userEmailValue, setUserEmailValue] = useState();
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleSourceChange = (value) => {
    setSourceValue(value);
  };
  const handleDestinationChange = (value) => {
    setDestinationValue(value);
  };
  const handleCabTypeChange = (value) => {
    setCabTypeValue(value);
  };

  const handleEmailChange = (event) => {
    setUserEmailValue(event.target.value);
  };

  const sourceOptions = [
    { label: "A" },
    { label: "B" },
    { label: "C" },
    { label: "D" },
    { label: "E" },
  ];
  const destinationOptions = [
    { label: "A" },
    { label: "B" },
    { label: "C" },
    { label: "D" },
    { label: "E" },
  ];
  const cabTypeOptions = [
    { label: "Sedan (Fair - 100/minute)", value: 0 },
    { label: "SUV (Fair - 120/minute)", value: 1 },
    { label: "Van (Fair - 140/minute)", value: 2 },
    { label: "HatchBack (Fair - 80/minute)", value: 4 },
    { label: "Coupe (Fair - 200/minute)", value: 5 },
  ];

  const checkAvailaibility = () => {
    console.log(timeValue);
    console.log(dateValue);
    console.log(sourceValue);
    console.log(destinationValue);
    console.log(cabTypeValue);
    console.log(userEmailValue);
  };
  const bookCab = () => {};
  return (
    <div id="cab_book_container">
      <div id="cab_book_container_cabDetails">
        <div id="cab_book_container_cabDetails_title" class="title_class">
          Fill Cab Details
        </div>
        <div id="cab_book_container_cabDetails_details">
          <div id="cab_book_container_first">
            <div
              class="cab_book_container_chooseClass"
              id="cab_book_container_source"
            >
              <Select
                value={sourceValue}
                onChange={handleSourceChange}
                options={sourceOptions}
                placeholder="Select Source"
                isMulti={false} // Set to false to allow only one option to be selected
                className="cab_book_container_sourceSelect"
              />
            </div>
            <div
              class="cab_book_container_chooseClass"
              id="cab_book_container_destination"
            >
              <Select
                value={destinationValue}
                onChange={handleDestinationChange}
                options={destinationOptions}
                placeholder="Select Destination"
                isMulti={false} // Set to false to allow only one option to be selected
                className="cab_book_container_destinationSelect"
              />
            </div>
          </div>
          <div id="cab_book_container_second">
            <div
              class="cab_book_container_chooseClass"
              id="cab_book_container_cabType"
            >
              <Select
                value={cabTypeValue}
                onChange={handleCabTypeChange}
                options={cabTypeOptions}
                placeholder="Select Cab Type"
                isMulti={false} // Set to false to allow only one option to be selected
                className="cab_book_container_cabTypeSelect"
              />
            </div>
          </div>
          <div id="cab_book_container_third">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div id="date_container">
                <DatePicker
                  value={dateValue}
                  minDate={today}
                  onChange={(newValue) => {
                    setDateValue(newValue);
                  }}
                  label="Select Pickup Date"
                />
              </div>
              <div id="time_container">
                <TimePicker
                  value={timeValue}
                  onChange={(newValue) => {
                    setTimeValue(newValue);
                  }}
                  label="Select Pickup Time"
                />
              </div>
            </LocalizationProvider>
          </div>
        </div>
      </div>
      <div id="cab_book_container_userDetails">
        <div id="cab_book_container_userDetails_title" class="title_class">
          Fill user Details
        </div>
        <div id="cab_book_container_userDetails_details">
          <div id="cab_book_container_userDetails_details_title">
            Enter user Email
          </div>
          <input
            type="email"
            placeholder="e.g abc@example.com"
            id="cab_book_container_userDetails_details_emailInput"
            onChange={handleEmailChange}
          />
          {!isValidEmail && (
            <div style={{ color: "red" }}>Invalid email format</div>
          )}
        </div>
      </div>
      <div id="cab_book_container_bookingDetails">
        <div id="cab_book_container_bookingDetails_first">
          <div
            id="cab_book_container_bookingDetails_checkAvailaibility"
            onClick={checkAvailaibility}
          >
            Check availaiblity and Charges
          </div>
          <div id="cab_book_container_bookingDetails_bookCab" onClick={bookCab}>
            Book Cab
          </div>
        </div>
        <div id="cab_book_container_bookingDetails_second">
          <div id="cab_book_container_bookingDetails_showBox"></div>
        </div>
      </div>
    </div>
  );
};
export default BookCab;
