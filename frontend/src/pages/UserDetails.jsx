import { useEffect, useState } from "react";
import { userService } from "../services/user.service";
import { useParams } from "react-router";
import { showErrorMsg } from "../services/event-bus.service";

export function UserDetails() {
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    loadUser();
  }, [userId]);

  useEffect(() => {
    console.log(user);
  }, [user]);

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
