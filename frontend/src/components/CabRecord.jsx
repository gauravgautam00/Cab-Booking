import "./CabRecord.css";
import React from "react";
import { useRef, useState, useEffect } from "react";
import { dijkastra } from "../utilities/dijkastra";

import { v4 as uuidv4 } from "uuid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Select from "react-select";
import dayjs from "dayjs";

const CabRecord = () => {
  const [prevBookingdata, setPrevBookingData] = useState(null);
  const [nextBookingdata, setNextBookingData] = useState(null);
  const [selectedEditContainer, setSelectedEditContainer] = useState();
  const today = dayjs();
  const [timeValue, setTimeValue] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  const [sourceValue, setSourceValue] = useState(null);
  const [destinationValue, setDestinationValue] = useState(null);
  const [cabTypeValue, setCabTypeValue] = useState(null);
  const [isCabAvailable, setIsCabAvailable] = useState();
  const [editContainerDetails, setEditContainerDetails] = useState();
  const [availabilityClicked, setAvailabilityClicked] = useState();
  const [loadingUpcomingReservations, setLoadingUpcomingReservations] =
    useState(false);
  const [fetchedCabTypeOptions, setFetchedCabTypeOptions] = useState([]);

  const inputElementForPastBooking = useRef(null);
  const inputElementForFutureBooking = useRef(null);
  const editContainer = useRef(null);

  const handleCabTypeChange = (value) => {
    console.log(value);
    setAvailabilityClicked(false);
    setCabTypeValue(value);
  };

  // const cabTypeOptions = [
  //   { label: "Sedan (Fair - 100/minute)", value: "0", charge: 100 },
  //   { label: "SUV (Fair - 120/minute)", value: "1", charge: 120 },
  //   { label: "Van (Fair - 140/minute)", value: "2", charge: 140 },
  //   { label: "HatchBack (Fair - 80/minute)", value: "3", charge: 80 },
  //   { label: "Coupe (Fair - 200/minute)", value: "4", charge: 200 },
  // ];
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

  const handleSourceChange = (value) => {
    setAvailabilityClicked(false);

    setSourceValue(value);
  };
  const handleDestinationChange = (value) => {
    setAvailabilityClicked(false);

    setDestinationValue(value);
  };
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

  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSearchForPastBooking = () => {
    if (inputElementForPastBooking.current) {
      const userEmail = inputElementForPastBooking.current.value;
      if (!userEmail) {
        alert("kindly enter Email first");
        return;
      }
      if (!validateEmail(userEmail)) {
        alert("Email is not correct");
        return;
      }

      fetch(
        `http://localhost:4500/cab/previousBooking?userEmail=${encodeURIComponent(
          userEmail
        )}`
      )
        .then(async (res) => {
          if (!res.ok) {
            return res.json().then((data) => {
              throw new Error(
                `Error occurred while fetching previous Booking ${res.status} message is ${data.message}`
              );
            });
          }
          return res.json();
        })
        .then((response) => {
          console.log(
            "success fetching previous booking",
            response.prevBooking
          );
          setPrevBookingData(response.prevBooking);
          console.log(prevBookingdata);
        })
        .catch((err) => {
          console.log("Some error occurred while fetching ", err.message);
        });
    }
  };

  const handleSearchForFutureBooking = (parameterUserEmail) => {
    if (inputElementForFutureBooking.current) {
      setLoadingUpcomingReservations(true);
      const userEmail =
        parameterUserEmail || inputElementForFutureBooking.current.value;
      if (!userEmail) {
        alert("kindly enter Email first");
        return;
      }
      console.log("useremail", userEmail);
      if (!validateEmail(userEmail)) {
        alert("Email is not correct");
        return;
      }
      fetch(
        `http://localhost:4500/cab/upcomingBooking?userEmail=${encodeURIComponent(
          userEmail
        )}`
      )
        .then(async (res) => {
          if (!res.ok) {
            return res.json().then((data) => {
              throw new Error(
                `Error occurred while fetching upcoming Booking ${res.status} message is ${data.message}`
              );
            });
          }
          return res.json();
        })
        .then((response) => {
          console.log(
            "success fetching upcoming booking",
            response.nextBooking
          );
          setNextBookingData(response.nextBooking);
          setIsCabAvailable(false);
          setAvailabilityClicked(false);
          setDateValue(null);
          setTimeValue(null);
          setSourceValue(null);
          setDestinationValue(null);
          setCabTypeValue(null);
          setSelectedEditContainer("");
          console.log(nextBookingdata);
          setLoadingUpcomingReservations(false);
        })
        .catch((err) => {
          console.log("Some error occurred while fetching ", err.message);
          setLoadingUpcomingReservations(false);
        });
    }
  };

  const handleDeleteBooking = (id, userEmail) => {
    fetch(`http://localhost:4500/cab/deleteBooking/${id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(
              `Error occurred while deleting Booking ${res.status} message is ${data.message}`
            );
          });
        }
        return res.json();
      })
      .then((response) => {
        alert("Sucessfully deleted booking");
        handleSearchForFutureBooking(userEmail);
      })
      .catch((err) => {
        alert(
          "Some error occurred while deleting the booking , try again later"
        );
      });
  };

  const handleEditBooking = (
    id,
    source,
    destination,
    timeParameter,
    cabType,
    email
  ) => {
    console.log(
      dateValue,
      timeValue,
      sourceValue,
      destinationValue,
      cabTypeValue
    );

    setSelectedEditContainer(id);
    const dateTimeString = timeParameter;
    // console.log(dateTimeString);
    const [dateString, timeString] = dateTimeString.split(", ");
    // console.log(dateString, timeString);
    const splittedDate = dateString.split("/");
    // console.log(splittedDate[1]);
    const month = splittedDate[0];
    const day = splittedDate[1];
    const year = splittedDate[2];
    // console.log(day);
    const formattedDate = month + "-" + day + "-" + year;
    // console.log(formattedDate);
    const [time, period] = timeString.split(" ");
    const [hours, minutes] = time.split(":");
    const formattedTime = `${hours}:${minutes} ${period}`;
    setEditContainerDetails({
      id: id,
      source: source,
      destination: destination,
      date: formattedDate,
      time: formattedTime,
      cabType,
      userEmail: email,
    });

    console.log("in handle edit booking", {
      id: id,
      source: source,
      destination: destination,
      date: formattedDate,
      time: formattedTime,
      cabType,
      userEmail: email,
    });
  };
  const handleEditCancel = () => {
    setDateValue(null);
    setTimeValue(null);
    setSourceValue(null);
    setDestinationValue(null);
    setCabTypeValue(null);
    setAvailabilityClicked(false);
    setIsCabAvailable(false);
    setSelectedEditContainer("");
  };

  // ###################################################################

  const checkAvailability = () => {
    setAvailabilityClicked(true);
    setIsCabAvailable(true);
    let val = dijkastra(
      sourceValue
        ? sourceValue.label.substring(sourceValue.label.length - 1)
        : editContainerDetails.source,
      destinationValue
        ? destinationValue.label.substring(destinationValue.label.length - 1)
        : editContainerDetails.destination
    );
    let date = "";
    date = dateValue
      ? dateValue.$M + 1 + "-" + dateValue.$D + "-" + dateValue.$y
      : editContainerDetails.date;
    let startTime = "";
    startTime = timeValue
      ? timeValue.$H +
        ":" +
        timeValue.$m +
        " " +
        (timeValue.$H >= 12 ? "PM" : "AM")
      : editContainerDetails.time;

    let endTime = findEndTime(startTime, val);

    const bodyData = {
      cabType: cabTypeValue ? cabTypeValue : editContainerDetails.cabType,
      pickUpDate: date,
      pickUpStartTime: startTime.substring(0, startTime.length - 3),
      pickUpEndTime: endTime.substring(0, endTime.length - 3),
    };
    const toUpdateData = {
      source: sourceValue
        ? sourceValue.label.substring(sourceValue.label.length - 1)
        : editContainerDetails.source,
      destination: destinationValue
        ? destinationValue.label.substring(destinationValue.label.length - 1)
        : editContainerDetails.destination,
      date,
      startTime: startTime.substring(0, startTime.length - 3),
      endTime: endTime.substring(0, endTime.length - 3),
      cabType: cabTypeValue
        ? cabTypeValue
        : fetchedCabTypeOptions.filter(
            (ele) => ele.value == editContainerDetails.cabType
          )[0],
      val,
      id: editContainerDetails.id,
    };
    console.log("toUpdate data in check availability", toUpdateData);

    fetch("http://localhost:4500/check/availability", {
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
        console.log(
          "Response from check availability in cabsrecords",
          response
        );
        setIsCabAvailable(true);
        console.log("calling the update cab function");
        updateCab(toUpdateData);
      })
      .catch((err) => {
        console.log("Cab is not available", err.message);
        setIsCabAvailable(false);
        return;
      });
  };
  const updateCab = (jsonData) => {
    const bodyData = {
      cabType: jsonData.cabType,
      pickUpDate: jsonData.date,
      pickUpStartTime: jsonData.startTime,
      pickUpEndTime: jsonData.endTime,
      source: jsonData.source,
      destination: jsonData.destination,
      price: jsonData.val * jsonData.cabType.charge,
    };

    console.log(
      "coming in update cab function and the bodydata for the same is ",
      bodyData
    );

    fetch(`http://localhost:4500/cab/update/${jsonData.id}`, {
      method: "PUT",
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
        alert("Successfully updated the cab booking");
        console.log(
          "in update cab fulfilled promise the response got is ",
          response
        );
        handleSearchForFutureBooking(editContainerDetails.userEmail);
        setDateValue(null);
        setTimeValue(null);
        setSourceValue(null);
        setDestinationValue(null);
        setCabTypeValue(null);
      })
      .catch((err) => {
        console.log("Some error occurred while booking the cab", err);
        alert(
          "Some error occurred while updating the cab booking , Try again later"
        );
      });
  };

  // #####################################################################

  const handleUpdate = () => {
    if (
      !dateValue &&
      !timeValue &&
      !sourceValue &&
      !destinationValue &&
      !cabTypeValue
    ) {
      alert("Change atleast one paramter to update");
      return;
    }
    checkAvailability();
  };

  useEffect(() => {
    fetch("http://localhost:4500/cabType/getTypes")
      .then((res) => res.json())
      .then((response) => {
        // const optionArr=[];

        const tempCabType = [];
        response.cabTypeOptions.map((ele) => {
          tempCabType.push({
            label: ele.label + " Fair(" + ele.charge + "/minutes )",
            value: ele.value,
            charge: ele.charge,
          });
        });
        setFetchedCabTypeOptions(tempCabType);
        // console.log("response fetched caboptions", cabTypeOptions);
      });
  }, [selectedEditContainer]);
  return (
    <div id="cab_record_container">
      <div id="cab_record_container_title">Cab Records</div>
      <div id="cab_record_container_first">
        <div
          id="cab_record_container_first_title"
          className="cab_record_container_titleClass"
        >
          View Past Cabs Reservation
        </div>
        <div id="cab_record_container_first_description">
          <div
            id="cab_record_container_first_description_getEmail"
            className="cab_record_container_description_getEmailClass"
          >
            <div
              id="cab_record_container_first_description_getEmail_first"
              className="cab_record_container_description_getEmail_firstClass"
            >
              <div
                id="cab_record_container_first_description_getEmail_first_title"
                className="cab_record_container_description_getEmail_first_titleClass"
              >
                Enter user email
              </div>
              <input
                type="email"
                id="cab_record_container_first_description_getEmail_first_input"
                className="cab_record_container_description_getEmail_first_inputClass"
                ref={inputElementForPastBooking}
              />
            </div>
            <div
              id="cab_record_container_first_description_getEmail_search"
              className="cab_record_container_description_getEmail_searchClass"
              onClick={handleSearchForPastBooking}
            >
              Search
            </div>
          </div>
          <div
            id="cab_record_container_first_description_showRecords"
            className="cab_record_container_description_showRecordsClass"
          >
            {prevBookingdata
              ? prevBookingdata.length > 0
                ? prevBookingdata.map((reservation) => {
                    return (
                      <div
                        id="prev_bookingData_container"
                        className="resultedbookingData_container"
                        key={uuidv4()}
                      >
                        <div className="resultedData_child_marginClass">
                          <strong>userEmail:</strong> {reservation.userEmail}
                        </div>
                        <div className="resultedData_child_marginClass">
                          <strong>Source:</strong> {reservation.source}
                        </div>
                        <div className="resultedData_child_marginClass">
                          <strong>Destination:</strong>{" "}
                          {reservation.destination}
                        </div>
                        <div className="resultedData_child_marginClass">
                          <strong>Start Time :</strong>{" "}
                          {new Date(reservation.startTime).toLocaleString()}
                        </div>
                        <div className="resultedData_child_marginClass">
                          <strong>End Time :</strong>{" "}
                          {new Date(reservation.endTime).toLocaleString()}
                        </div>
                        <div className="resultedData_child_marginClass">
                          <strong>Fare:</strong> {reservation.price}
                        </div>
                        <div className="resultedData_child_marginClass">
                          <strong>Cab Type:</strong>
                          {fetchedCabTypeOptions.find(
                            (ele) => ele.value == reservation.cabType
                          )?.label || "Unknown Cab Type"}
                        </div>
                      </div>
                    );
                  })
                : "NO previous bookings"
              : "Enter user email to view all past reservations"}
          </div>
        </div>
      </div>
      <div id="cab_record_container_second">
        <div
          id="cab_record_container_second_title"
          className="cab_record_container_titleClass"
        >
          Track/Edit Upcoming Cabs Reservation
        </div>
        <div id="cab_record_container_second_description">
          {/* ############################################################ */}

          <div
            id="cab_record_container_second_description_getEmail"
            className="cab_record_container_description_getEmailClass"
          >
            <div
              id="cab_record_container_second_description_getEmail_first"
              className="cab_record_container_description_getEmail_firstClass"
            >
              <div
                id="cab_record_container_second_description_getEmail_first_title"
                className="cab_record_container_description_getEmail_first_titleClass"
              >
                Enter user email
              </div>
              <input
                type="email"
                id="cab_record_container_second_description_getEmail_first_input"
                className="cab_record_container_description_getEmail_first_inputClass"
                ref={inputElementForFutureBooking}
              />
            </div>
            <div
              id="cab_record_container_second_description_getEmail_search"
              className="cab_record_container_description_getEmail_searchClass"
              onClick={() => {
                handleSearchForFutureBooking("");
              }}
            >
              Search
            </div>
          </div>
          {loadingUpcomingReservations ? (
            <div className="cab_record_container_description_showRecordsClass">
              Loading...
            </div>
          ) : (
            <div
              id="cab_record_container_second_description_showRecords"
              className="cab_record_container_description_showRecordsClass"
            >
              {nextBookingdata
                ? nextBookingdata.length > 0
                  ? nextBookingdata.map((reservation) => {
                      return (
                        <div>
                          <div
                            id="next_bookingData_container"
                            className="resultedbookingData_container"
                            key={uuidv4()}
                          >
                            <div id="next_bookingData_container_first">
                              <div className="resultedData_child_marginClass">
                                <strong>userEmail:</strong>{" "}
                                {reservation.userEmail}
                              </div>
                              <div className="resultedData_child_marginClass">
                                <strong>Source:</strong> {reservation.source}
                              </div>
                              <div className="resultedData_child_marginClass">
                                <strong>Destination:</strong>{" "}
                                {reservation.destination}
                              </div>
                              <div className="resultedData_child_marginClass">
                                <strong>Start Time :</strong>{" "}
                                {new Date(
                                  reservation.startTime
                                ).toLocaleString()}
                              </div>
                              <div className="resultedData_child_marginClass">
                                <strong>Estimated End Time :</strong>{" "}
                                {new Date(reservation.endTime).toLocaleString()}
                              </div>
                              <div className="resultedData_child_marginClass">
                                <strong>Fare:</strong> {reservation.price}
                              </div>
                              <div className="resultedData_child_marginClass">
                                <strong>Cab Type:</strong>
                                {fetchedCabTypeOptions.find(
                                  (ele) => ele.value == reservation.cabType
                                )?.label || "Unknown Cab Type"}
                              </div>
                            </div>
                            <div id="next_bookingData_container_second">
                              <span
                                id="next_bookingData_container_second_deleteIcon"
                                class="material-symbols-outlined"
                                onClick={() =>
                                  handleDeleteBooking(
                                    reservation._id,
                                    reservation.userEmail
                                  )
                                }
                              >
                                delete
                              </span>
                              <span
                                id="next_bookingData_container_second_editIcon"
                                class="material-symbols-outlined"
                                onClick={() =>
                                  handleEditBooking(
                                    reservation._id,
                                    reservation.source,
                                    reservation.destination,
                                    new Date(
                                      reservation.startTime
                                    ).toLocaleString(),
                                    reservation.cabType,
                                    reservation.userEmail
                                  )
                                }
                              >
                                edit
                              </span>
                            </div>
                          </div>
                          <div
                            id="next_bookingData_container_editContainer"
                            style={{
                              height:
                                selectedEditContainer == reservation._id
                                  ? "auto"
                                  : "0rem",
                            }}
                            ref={editContainer}
                          >
                            <div id="next_bookingData_container_editContainer_title">
                              Edit Details -
                            </div>
                            <div id="next_bookingData_container_editContainer_fillDetails">
                              <div
                                id="next_bookingData_container_editContainer_fillDetails_source"
                                className="next_bookingData_container_editContainer_fillDetails_childClass"
                              >
                                <div
                                  id="next_bookingData_container_editContainer_fillDetails_source_title"
                                  className="next_bookingData_container_editContainer_fillDetails_childClass_titleChild"
                                >
                                  Update source -
                                </div>
                                <div
                                  id="next_bookingData_container_editContainer_fillDetails_source_select"
                                  className="next_bookingData_container_editContainer_fillDetails_childClass_selectChild"
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
                              </div>
                              <div
                                id="next_bookingData_container_editContainer_fillDetails_destination"
                                className="next_bookingData_container_editContainer_fillDetails_childClass"
                              >
                                <div
                                  id="next_bookingData_container_editContainer_fillDetails_destination_title"
                                  className="next_bookingData_container_editContainer_fillDetails_childClass_titleChild"
                                >
                                  Update destination -
                                </div>
                                <div
                                  id="next_bookingData_container_editContainer_fillDetails_destination_select"
                                  className="next_bookingData_container_editContainer_fillDetails_childClass_selectChild"
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
                              <div
                                id="next_bookingData_container_editContainer_fillDetails_cabType"
                                className="next_bookingData_container_editContainer_fillDetails_childClass"
                              >
                                <div
                                  id="next_bookingData_container_editContainer_fillDetails_cabType_title"
                                  className="next_bookingData_container_editContainer_fillDetails_childClass_titleChild"
                                >
                                  Update cabType -
                                </div>
                                <div
                                  id="next_bookingData_container_editContainer_fillDetails_cabType_select"
                                  className="next_bookingData_container_editContainer_fillDetails_childClass_selectChild"
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
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div
                                  id="next_bookingData_container_editContainer_fillDetails_pickUpTime"
                                  className="next_bookingData_container_editContainer_fillDetails_childClass"
                                >
                                  <div
                                    id="next_bookingData_container_editContainer_fillDetails_pickUpTime_title"
                                    className="next_bookingData_container_editContainer_fillDetails_childClass_titleChild"
                                  >
                                    Update pickUpTime -
                                  </div>
                                  <div
                                    id="next_bookingData_container_editContainer_fillDetails_pickUpTime_select"
                                    className="next_bookingData_container_editContainer_fillDetails_childClass_selectChild"
                                  >
                                    <TimePicker
                                      value={timeValue}
                                      onChange={(newValue) => {
                                        setAvailabilityClicked(false);
                                        setTimeValue(newValue);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div
                                  id="next_bookingData_container_editContainer_fillDetails_pickUpDate"
                                  className="next_bookingData_container_editContainer_fillDetails_childClass"
                                >
                                  <div
                                    id="next_bookingData_container_editContainer_fillDetails_pickUpDate_title"
                                    className="next_bookingData_container_editContainer_fillDetails_childClass_titleChild"
                                  >
                                    Update pickUpDate -
                                  </div>
                                  <div
                                    id="next_bookingData_container_editContainer_fillDetails_pickUpDate_select"
                                    className="next_bookingData_container_editContainer_fillDetails_childClass_selectChild"
                                  >
                                    <DatePicker
                                      value={dateValue}
                                      minDate={today}
                                      onChange={(newValue) => {
                                        setAvailabilityClicked(false);
                                        setDateValue(newValue);
                                      }}
                                    />
                                  </div>
                                </div>
                              </LocalizationProvider>
                            </div>
                            <div id="next_bookingData_container_editContainer_Button">
                              {availabilityClicked ? (
                                !isCabAvailable ? (
                                  <div id="no_cabAvailable_prompt">
                                    "This cab is not available try to change
                                    some paramter"
                                  </div>
                                ) : (
                                  <div id="no_cabAvailable_prompt">
                                    "Loading"
                                  </div>
                                )
                              ) : (
                                ""
                              )}
                              <button
                                id="next_bookingData_container_editContainer_Button_update"
                                onClick={handleUpdate}
                              >
                                Update
                              </button>
                              <button
                                onClick={handleEditCancel}
                                id="next_bookingData_container_editContainer_Button_cancel"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : "NO upcoming bookings"
                : "Enter user email to view all future reservations"}
            </div>
          )}
          {/* ############################################################## */}
        </div>
      </div>
    </div>
  );
};

export default CabRecord;
