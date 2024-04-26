const Logout = ({ handleLogout }) => (
  <form onSubmit={handleLogout}>
    <div>
      <button type="submit">logout</button>
    </div>
  </form>
)

export default Logout