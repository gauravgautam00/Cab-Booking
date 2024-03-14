import "./CabRecord.css";
import React from "react";

const CabRecord = () => {
  return (
    <div id="cab_record_container">
      <div id="cab_record_container_title">Cab Records</div>
      <div id="cab_record_container_first">
        <div id="cab_record_container_first_title">
          View Past Cabs Reservation
        </div>
        <div id="cab_record_container_first_description"></div>
      </div>
      <div id="cab_record_container_second">
        <div id="cab_record_container_second_title">
          Track/Edit Upcoming Cabs Reservation
        </div>
        <div id="cab_record_container_second_description"></div>
      </div>
    </div>
  );
};

export default CabRecord;
