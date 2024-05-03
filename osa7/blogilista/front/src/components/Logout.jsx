import { Button } from "react-bootstrap";

const Logout = ({ handleLogout }) => (
  <form onSubmit={handleLogout}>
    <div>
      <Button type="submit">logout</Button>
    </div>
  </form>
);

export default Logout;
