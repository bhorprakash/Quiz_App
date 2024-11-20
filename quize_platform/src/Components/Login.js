import React, { useState } from "react";
import { Container, Title, Form, Input, Button, Error } from "./Styles";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setError("All fields are required.");
    } else {
      setError("");
      console.log("Login successful:", { email, password });
    }
  };

  return (
    <Container>
      <Title>Login</Title>
      <Form onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Error>{error}</Error>}
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
}

export default Login;
