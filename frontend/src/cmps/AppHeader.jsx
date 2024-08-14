import { Modal } from "antd";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";

export function AppHeader({ setUser, user }) {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegistration, setOpenRegistration] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [showMsg, setShowMsg] = useState(false);
  useEffect(() => {
    existUser();
  }, []);

  async function existUser() {
    const user = await userService.validateUser();
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  }

  function onClose() {
    setOpenLogin(false);
    setOpenRegistration(false);
    setShowMsg(false);
    setFormData((prev) => ({
      username: "",
      password: "",
      email: "",
    }));
  }

  function onChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.className]: e.target.value }));
  }
  async function onSubmit(e) {
    e.preventDefault();
    setShowMsg(false);
    try {
      if (formData.email.length) {
        const user = await authService.signUp(formData);
        setUser(user);
      } else {
        const data = {
          username: formData.username,
          password: formData.password,
        };
        const user = await authService.login(data);
        setUser(user);
      }
      onClose();
    } catch (err) {
      if (err.response.status === 401 || err.response.status === 409) {
        setShowMsg(true);
      } else {
        console.log(err);
      }
    }
  }
  async function onLogout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <header className="app-header container">
      <div className="header-container">
        <nav className="app-nav">
          <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
          <NavLink to="/about">About</NavLink>
        </nav>
        <h1>Bugs are Forever</h1>
        <div className="non-user-btns">
          {user ? (
            <div>
              <Link to={`/u/${user.id}`}>{user.username}</Link>
              <button onClick={onLogout}>Logout</button>
            </div>
          ) : (
            <>
              <button onClick={() => setOpenLogin(true)}>Sign in</button>
              <button onClick={() => setOpenRegistration(true)}>Sign up</button>
            </>
          )}
        </div>
        <Modal
          open={openLogin}
          closeIcon={false}
          footer=""
          className="form-modal reg"
        >
          <form onSubmit={onSubmit}>
            <section>
              <p>Username:</p>
              <input
                type="text"
                className="username"
                required
                value={formData?.username}
                onChange={(e) => onChange(e)}
              />
            </section>
            <section>
              <p>Password:</p>
              <input
                type="text"
                className="password"
                required
                value={formData?.password}
                onChange={(e) => onChange(e)}
              />
            </section>
            {showMsg && (
              <span className="msg">Wrong username or password.</span>
            )}
            <div>
              <button>Login</button>
              <button type="button" className="close-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
        <Modal
          open={openRegistration}
          closeIcon={false}
          footer=""
          className="form-modal reg"
        >
          <form onSubmit={onSubmit}>
            <section>
              <p>Username:</p>
              <input
                type="text"
                className="username"
                required
                value={formData?.username}
                onChange={(e) => onChange(e)}
              />
            </section>
            <section>
              <p>Email:</p>
              <input
                type="email"
                className="email"
                required
                value={formData?.email}
                onChange={(e) => onChange(e)}
              />
            </section>
            <section>
              <p>Password:</p>
              <input
                type="text"
                className="password"
                required
                value={formData?.password}
                onChange={(e) => onChange(e)}
              />
            </section>
            {showMsg && (
              <span className="msg">
                User with that username already exists.
              </span>
            )}
            <div>
              <button>Create Account</button>
              <button type="button" className="close-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </header>
  );
}
