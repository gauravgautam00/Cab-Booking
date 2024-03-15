import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_container">
        <div className="footer_left">
          <h3>About Us</h3>
          <p>
            We provide convenient and reliable cab booking services to our
            customers.
          </p>
          <p>
            Ride History: Provide users with access to their ride history,
            including details like pickup
          </p>
          <p>
            Rating and Reviews: Allow users to rate drivers and leave reviews
            after completing a ride.
          </p>
        </div>
      </div>
      <div className="footer__right">
        <div className="footer_right_first">
          <h3>Contact Us</h3>
          <p>Email: info@cabbooking.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
        <div id="footer_right_second">
          <p>&copy; 2024 CabBooking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
