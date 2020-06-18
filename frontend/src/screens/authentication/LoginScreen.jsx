import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { useNavigate } from "@reach/router";
import useForm from "../../hooks/useForm";
import { useAuth } from "../../hooks/useProvideAuth";
import AuthScreen from "./AuthScreen";

export default () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [creds, handleChange] = useForm({
    username: "",
    password: "",
  });
  return (
    <AuthScreen
      fields={getFields(creds, handleChange)}
      actions={getActions(signIn, navigate, creds)}
    />
  );
};

const getFields = ({ username, password }, handleChange) => (
  <>
    <TextField
      style={styles.textField}
      value={username}
      onChange={handleChange}
      placeholder="Username"
      name="username"
    />
    <TextField
      style={styles.textField}
      value={password}
      onChange={handleChange}
      placeholder="Password"
      name="password"
      type="password"
    />
    <Link
      style={{ alignSelf: "flex-start" }}
      component="button"
      variant="body2"
    >
      Forgot my password
    </Link>
  </>
);

const getActions = (signIn, navigate, { username, password }) => (
  <>
    <Button
      variant="contained"
      color="primary"
      disableElevation
      style={{ ...styles.button, marginRight: 5 }}
      onClick={() => signIn({ username, password })}
    >
      Sign In
    </Button>
    <Button
      style={{ ...styles.button, marginLeft: 5 }}
      onClick={() => navigate("/register")}
    >
      Register
    </Button>
  </>
);

const styles = {
  textField: {
    marginBottom: 20,
  },
  button: {
    flex: 1,
  },
};
