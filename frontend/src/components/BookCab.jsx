import "./BookCab.css";
import { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Select from "react-select";
import dayjs from "dayjs";
import { dijkastra } from "../utilities/dijkastra";
import { v4 as uuidv4 } from "uuid";

import CabRecord from "./CabRecord";
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
  const [clickedAvailableButton, setClickedAvailableButton] = useState(false);
  const [humanReadableDate, setHumanReadableDate] = useState();
  const [humanReadableTime, setHumanReadableTime] = useState();
  const [cabAvailable, setCabAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCabBooked, setIsCabBooked] = useState(false);
  const [fetchedCabTypeOptions, setFetchedCabTypeOptions] = useState([]);

  //details for booking
  //details for booking
  //details for booking
  //details for booking

  const handleSourceChange = (value) => {
    setClickedAvailableButton(false);
    setSourceValue(value);
  };
  const handleDestinationChange = (value) => {
    setClickedAvailableButton(false);

    setDestinationValue(value);
  };
  const handleCabTypeChange = (value) => {
    console.log(value);
    setClickedAvailableButton(false);
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
  // const cabTypeOptions = [
  //   { label: "Sedan (Fair - 100/minute)", value: "0", charge: 100 },
  //   { label: "SUV (Fair - 120/minute)", value: "1", charge: 120 },
  //   { label: "Van (Fair - 140/minute)", value: "2", charge: 140 },
  //   { label: "HatchBack (Fair - 80/minute)", value: "3", charge: 80 },
  //   { label: "Coupe (Fair - 200/minute)", value: "4", charge: 200 },
  // ];
  let cabTypeOptions = [];
  useEffect(() => {
    fetch("https://cab-booking-1.onrender.com/cabType/getTypes")
      .then((res) => res.json())
      .then((response) => {
        // const optionArr=[];

        cabTypeOptions = [];
        const tempCabType = [];
        response.cabTypeOptions.map((ele) => {
          cabTypeOptions.push({
            label: ele.label,
            value: ele.value,
            charge: ele.charge,
          });
          tempCabType.push({
            label: ele.label + " Fair(" + ele.charge + "/minutes )",
            value: ele.value,
            charge: ele.charge,
          });
        });
        setFetchedCabTypeOptions(tempCabType);
        console.log("response fetched caboptions", cabTypeOptions);
      });
  }, []);
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
    validateCabTypeValue
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

    return true;
  };

  //find end time
  //find end time
  //find end time
  //find end time

  const findEndTime = (startTime, val) => {
    const [hours, minutes] = startTime.split(":");
    const parsedHour = parseInt(hours);
    const parsedMinutes = parseInt(minutes);

    const totalMinutes = parsedHour * 60 + parsedMinutes + val;

    const endTimeHour = Math.floor(totalMinutes / 60) % 24;
    const endTimeMinute = totalMinutes % 60;
    const amPm = endTimeHour >= 12 ? "PM" : "AM";
    const newTime = endTimeHour + ":" + endTimeMinute + " " + amPm;
    return newTime;
  };

  // booking buttons
  // booking buttons
  // booking buttons
  // booking buttons

  const checkAvailability = () => {
    setLoading(true);
    const validationPassed = validate(
      timeValue,
      dateValue,
      sourceValue,
      destinationValue,
      cabTypeValue
    );
    console.log(dateValue);

    if (!validationPassed) return false;

    let val = dijkastra(
      sourceValue.label.substring(sourceValue.label.length - 1),
      destinationValue.label.substring(destinationValue.label.length - 1)
    );
    let date = "";
    date = dateValue.$M + 1 + "-" + dateValue.$D + "-" + dateValue.$y;
    let startTime = "";
    startTime =
      timeValue.$H +
      ":" +
      timeValue.$m +
      " " +
      (timeValue.$H >= 12 ? "PM" : "AM");

    let endTime = findEndTime(startTime, val);

    const bodyData = {
      cabType: cabTypeValue,
      pickUpDate: date,
      pickUpStartTime: startTime.substring(0, startTime.length - 3),
      pickUpEndTime: endTime.substring(0, endTime.length - 3),
    };

    fetch("https://cab-booking-1.onrender.com/check/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    })
      .then(async (res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(
              `HTTP error! Status: ${res.status}, Message: ${data.message}`
            );
          });
        }
        return res.json();
      })
      .then((response) => {
        setLoading(false);
        console.log("Response from check availability", response);
        setHumanReadableDate(date);
        setHumanReadableTime(startTime);
        setCabAvailable(true);
        setRouteTime(val);
        setRouteCharge(val * cabTypeValue.charge);
        setClickedAvailableButton(true);
        setIsCabBooked(false);
        console.log("is cab available useState", cabAvailable);
      })
      .catch((err) => {
        setLoading(false);
        setIsCabBooked(false);
        setClickedAvailableButton(true);
        setCabAvailable(false);
        console.log("Cab is not available", err.message);
        console.log("is cab available useState", cabAvailable);
      });
  };
  const bookCab = () => {
    if (!clickedAvailableButton || !cabAvailable) return false;
    if (!userEmailValue || !validateEmail(userEmailValue)) {
      alert("Please enter suitable email");
      return false;
    }

    if (isCabBooked) {
      alert("This cab just got booked by you");
      return;
    }
    let val = dijkastra(
      sourceValue.label.substring(sourceValue.label.length - 1),
      destinationValue.label.substring(destinationValue.label.length - 1)
    );
    let date = "";
    date = dateValue.$M + 1 + "-" + dateValue.$D + "-" + dateValue.$y;
    let startTime = "";
    startTime =
      timeValue.$H +
      ":" +
      timeValue.$m +
      " " +
      (timeValue.$H >= 12 ? "PM" : "AM");

    let endTime = findEndTime(startTime, val);

    const bodyData = {
      cabType: cabTypeValue,
      pickUpDate: date,
      pickUpStartTime: startTime.substring(0, startTime.length - 3),
      pickUpEndTime: endTime.substring(0, endTime.length - 3),
      userEmail: userEmailValue,
      source: sourceValue.label.substring(sourceValue.label.length - 1),
      destination: destinationValue.label.substring(
        destinationValue.label.length - 1
      ),
      price: val * cabTypeValue.charge,
    };
    console.log("book cab body data", bodyData);

    fetch("https://cab-booking-1.onrender.com/cab/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    })
      .then(async (res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(
              `HTTP error! Status: ${res.status}, Message: ${data.message}`
            );
          });
        }
        return res.json();
      })
      .then((response) => {
        setIsCabBooked(true);
        // setClickedAvailableButton(false);
        console.log(response);
      })
      .catch((err) => {
        console.log("Some error occurred while booking the cab", err);
        setIsCabBooked(false);
      });
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
                options={fetchedCabTypeOptions}
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
                    setClickedAvailableButton(false);
                    setDateValue(newValue);
                  }}
                />
              </div>
              <div id="time_container">
                <div id="time_container_title">Select PickUp Time</div>

                <TimePicker
                  value={timeValue}
                  onChange={(newValue) => {
                    setClickedAvailableButton(false);
                    setTimeValue(newValue);
                  }}
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
            onClick={checkAvailability}
          >
            Check availablity and Charges
          </div>
          <div
            id="cab_book_container_bookingDetails_bookCab"
            title={
              clickedAvailableButton
                ? "Book Your cab"
                : "Please check availability first"
            }
            style={{
              cursor:
                clickedAvailableButton && cabAvailable
                  ? "pointer"
                  : "not-allowed",
            }}
            className={clickedAvailableButton ? "hover-shadow" : ""}
            onClick={bookCab}
          >
            Book Cab
          </div>
        </div>
        <div id="cab_book_container_bookingDetails_second">
          {!loading ? (
            clickedAvailableButton ? (
              <div id="cab_book_container_bookingDetails_showBox">
                <div id="cab_book_container_bookingDetails_showBox_signal">
                  {isCabBooked
                    ? "Success , Cab got booked for you"
                    : cabAvailable
                    ? "Availaible"
                    : "Not Available"}
                </div>
                {cabAvailable ? (
                  <>
                    <div id="cab_book_container_bookingDetails_showBox_title">
                      Here are the Cab details
                    </div>
                    <div id="cab_book_container_bookingDetails_showBox_details">
                      <div
                        id="cab_book_container_bookingDetails_showBox_details_source"
                        className="bookingDetails_details_class"
                      >
                        <span style={{ fontWeight: "700" }}>Source -</span>
                        {sourceValue.label.substring(
                          sourceValue.label.length - 1
                        )}
                      </div>
                      <div
                        id="cab_book_container_bookingDetails_showBox_details_destination"
                        className="bookingDetails_details_class"
                      >
                        <span style={{ fontWeight: "700" }}>
                          Destination -{" "}
                        </span>{" "}
                        {destinationValue.label.substring(
                          destinationValue.label.length - 1
                        )}
                      </div>
                      <div
                        id="cab_book_container_bookingDetails_showBox_details_cabType"
                        className="bookingDetails_details_class"
                      >
                        <span style={{ fontWeight: "700" }}>CabType -</span>{" "}
                        {cabTypeValue.label}
                      </div>
                      <div
                        id="cab_book_container_bookingDetails_showBox_details_date"
                        className="bookingDetails_details_class"
                      >
                        <span style={{ fontWeight: "700" }}> PickUp Date </span>
                        {dateValue.$M +
                          1 +
                          "-" +
                          dateValue.$D +
                          "-" +
                          dateValue.$y}
                      </div>
                      <div
                        id="cab_book_container_bookingDetails_showBox_details_time"
                        className="bookingDetails_details_class"
                      >
                        <span style={{ fontWeight: "700" }}>PickUp Time</span>{" "}
                        {humanReadableTime}
                      </div>
                      <div
                        id="cab_book_container_bookingDetails_showBox_details_routeTime"
                        className="bookingDetails_details_class"
                      >
                        <span style={{ fontWeight: "700" }}>
                          {" "}
                          Estimated time to reach destination
                        </span>{" "}
                        {routeTime} minutes
                      </div>
                      <div
                        id="cab_book_container_bookingDetails_showBox_details_charge"
                        className="bookingDetails_details_class"
                      >
                        <span style={{ fontWeight: "700" }}>
                          Fair for Cab(in rupees)
                        </span>{" "}
                        - {routeCharge}
                      </div>
                    </div>
                    <div id="cab_book_container_bookingDetails_showBox_footer">
                      {isCabBooked
                        ? "View your booked cab in Upcoming Cab Reservation section below"
                        : "Please click on Book Cab to book your cab (This is the final step)"}
                    </div>
                  </>
                ) : (
                  <div id="no_cab_forThisFilter">
                    Sorry Cab is Not Availaible , Try changing cab type or
                    pickup time
                  </div>
                )}
              </div>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </div>
      </div>
      <CabRecord />
    </div>
  );
};
export default BookCab;
