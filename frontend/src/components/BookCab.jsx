import "./BookCab.css";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Select from "react-select";
import dayjs from "dayjs";

const BookCab = () => {
  const today = dayjs();
  const [timeValue, setTimeValue] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  const [sourceValue, setSourceValue] = useState(null);
  const [destinationValue, setDestinationValue] = useState(null);
  const [cabTypeValue, setCabTypeValue] = useState(null);
  const [userEmailValue, setUserEmailValue] = useState();
  const [routeTime, setRouteTime] = useState(0);
  const [routeCharge, setRouteCharge] = useState(0);
  const [clickedAvailaibleButton, setClickedAvailaibleButton] = useState(false);
  const [humanReadableDate, setHumanReadableDate] = useState();
  const [humanReadableTime, setHumanReadableTime] = useState();
  const [cabAvailaible, setCabAvailaible] = useState(false);

  //dijkastra algo for shortest path
  //dijkastra algo for shortest path
  //dijkastra algo for shortest path
  //dijkastra algo for shortest path
  //dijkastra algo for shortest path
  const graph = {
    A: { B: 5, C: 7 },
    B: { A: 5, E: 20, D: 15 },
    C: { A: 7, E: 35, D: 5 },
    D: { B: 15, C: 5, F: 20 },
    E: { B: 20, C: 35, F: 10 },
    F: { D: 20, E: 10 },
  };

  const dijkastra = (graph, start, end) => {
    let distances = {};
    let allNodes = Object.keys(graph);
    for (let node of allNodes) {
      distances[node] = 100000;
    }
    distances[start] = 0;
    let pq = [{ [start]: 0 }];
    while (pq.length > 0) {
      pq.sort((a, b) => {
        let value1 = Object.values(a)[0];
        let value2 = Object.values(b)[0];
        return value1 - value2;
      });
      let num = pq.shift();

      if (Object.keys(num)[0] === end) {
        return Object.values(num)[0];
      }
      num = Object.keys(num)[0];
      for (let child in graph[num]) {
        let newDist = distances[num] + graph[num][child];
        if (newDist < distances[child]) {
          distances[child] = distances[num] + graph[num][child];
          pq.push({ [child]: distances[child] });
        }
      }
    }
    return -1;
  };

  //details for booking
  //details for booking
  //details for booking
  //details for booking

  const handleSourceChange = (value) => {
    setClickedAvailaibleButton(false);
    setSourceValue(value);
  };
  const handleDestinationChange = (value) => {
    setClickedAvailaibleButton(false);

    setDestinationValue(value);
  };
  const handleCabTypeChange = (value) => {
    setClickedAvailaibleButton(false);
    setCabTypeValue(value);
  };

  const handleEmailChange = (event) => {
    setUserEmailValue(event.target.value);
  };

  const sourceOptions = [
    { label: "Source - A" },
    { label: "Source - B" },
    { label: "Source - C" },
    { label: "Source - D" },
    { label: "Source - E" },
    { label: "Source - F" },
  ];
  const destinationOptions = [
    { label: "Destination - A" },
    { label: "Destination - B" },
    { label: "Destination - C" },
    { label: "Destination - D" },
    { label: "Destination - E" },
    { label: "Destination - F" },
  ];
  const cabTypeOptions = [
    { label: "Sedan (Fair - 100/minute)", value: 0, charge: 100 },
    { label: "SUV (Fair - 120/minute)", value: 1, charge: 120 },
    { label: "Van (Fair - 140/minute)", value: 2, charge: 140 },
    { label: "HatchBack (Fair - 80/minute)", value: 4, charge: 80 },
    { label: "Coupe (Fair - 200/minute)", value: 5, charge: 200 },
  ];
  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validate = (
    validateTimeValue,
    validateDateValue,
    validateSourceValue,
    validateDestinationValue,
    validateCabTypeValue,
    validateUserEmailValue
  ) => {
    if (!validateTimeValue) {
      alert("Please select suitable time");
      return false;
    }
    if (!validateDateValue) {
      alert("Please select suitable date");
      return false;
    }
    if (!validateSourceValue) {
      alert("Please select suitable source");
      return false;
    }
    if (!validateDestinationValue) {
      alert("Please select suitable destination");
      return false;
    }
    if (!validateCabTypeValue) {
      alert("Please select suitable cabType");
      return false;
    }
    if (!validateEmail(validateUserEmailValue)) {
      alert("Please enter suitable email");
      return false;
    }
    return true;
  };

  // booking buttons
  // booking buttons
  // booking buttons
  // booking buttons

  const checkAvailaibility = () => {
    const validationPassed = validate(
      timeValue,
      dateValue,
      sourceValue,
      destinationValue,
      cabTypeValue,
      userEmailValue
    );

    if (!validationPassed) return false;

    let val = dijkastra(
      graph,
      sourceValue.label.substring(sourceValue.label.length - 1),
      destinationValue.label.substring(destinationValue.label.length - 1)
    );
    let date = "";
    date = dateValue.$D + "-" + (dateValue.$M + 1) + "-" + dateValue.$y;
    let time = "";
    time = timeValue.$H + ":" + timeValue.$m;

    setHumanReadableDate(date);
    setHumanReadableTime(time);
    setRouteTime(val);
    setRouteCharge(val * cabTypeValue.charge);
    setClickedAvailaibleButton(true);
  };
  const bookCab = () => {
    if (clickedAvailaibleButton) {
    } else {
      checkAvailaibility();
    }
  };
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
                MenuProps={{
                  style: { zIndex: 9999 }, // Set the desired zIndex for the dropdown menu
                }}
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
                <div id="date_container_title">Select PickUp Date</div>
                <DatePicker
                  value={dateValue}
                  minDate={today}
                  onChange={(newValue) => {
                    setClickedAvailaibleButton(false);
                    setDateValue(newValue);
                  }}
                />
              </div>
              <div id="time_container">
                <div id="time_container_title">Select PickUp Time</div>

                <TimePicker
                  value={timeValue}
                  onChange={(newValue) => {
                    setClickedAvailaibleButton(false);
                    setTimeValue(newValue);
                  }}
                  // label="Select Pickup Time"
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
          {clickedAvailaibleButton ? (
            <div id="cab_book_container_bookingDetails_showBox">
              <div id="cab_book_container_bookingDetails_showBox_signal">
                {cabAvailaible
                  ? "Availaible"
                  : "Sorry Cab is Not Availaible  , Try changing cab type or pickup time"}
              </div>
              {cabAvailaible ? (
                <>
                  <div id="cab_book_container_bookingDetails_showBox_title">
                    Here are the Cab details
                  </div>
                  <div id="cab_book_container_bookingDetails_showBox_details">
                    {sourceValue.label}
                    {destinationValue.label}
                    {humanReadableDate}
                    {humanReadableTime}
                    Estimated time {routeTime}
                    Charge for Cab(in rupees) {routeCharge}
                  </div>
                  <div id="cab_book_container_bookingDetails_showBox_footer">
                    Please click on Book cab to book your cab (This is the final
                    step)
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
export default BookCab;
