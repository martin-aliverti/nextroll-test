import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useNavigate } from "@reach/router";
import { useAuth } from "../../hooks/useProvideAuth";
import useForm from "../../hooks/useForm";
import AuthScreen from "./AuthScreen";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [creds, handleChange] = useForm({
    name: "",
    username: "",
    password: "",
  });
  return (
    <AuthScreen
      flipBackground
      fields={getFields(creds, handleChange)}
      actions={getActions(signUp, navigate, creds)}
    />
  );
};

const getFields = ({ username, password, name }, handleChange) => (
  <>
    <TextField
      style={styles.textField}
      value={name}
      onChange={handleChange}
      placeholder="Name"
      name="name"
    />
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
  </>
);

const getActions = (signUp, navigate, { username, password, name }) => (
  <>
    <Button
      variant="contained"
      color="primary"
      disableElevation
      style={{ ...styles.button, marginRight: 5 }}
      onClick={() => signUp({ name, username, password })}
    >
      Register
    </Button>
    <Button
      style={{ ...styles.button, marginLeft: 5 }}
      onClick={() => navigate("/login")}
    >
      Sign In
    </Button>
  </>
);

export default RegisterScreen;

const styles = {
  textField: {
    marginBottom: 20,
  },
  button: {
    flex: 1,
  },
};
