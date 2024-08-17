import { useEffect, useState } from "react";
import { userService } from "../services/user.service";
import { useParams } from "react-router";
import { showErrorMsg } from "../services/event-bus.service";
import {
  SOCKET_EMIT_USER_WATCH,
  SOCKET_EVENT_USER_UPDATED,
  socketService,
} from "../services/socket.service";

export function UserDetails() {
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    loadUser();
    socketService.emit(SOCKET_EMIT_USER_WATCH, userId);
    socketService.on(SOCKET_EVENT_USER_UPDATED, updateUser);
    console.log("lol")
    return () => {
      socketService.off(SOCKET_EVENT_USER_UPDATED, updateUser);
    };
  }, [userId]);
  function updateUser(data) {
    setUser(data)
  }

  async function loadUser() {
    try {
      const user = await userService.getUser(userId);
      setUser(user);
    } catch (err) {
      showErrorMsg("Cannot load user");
    }
  }
  return (
    <section>
      <h1>User Details</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </section>
  );
}
