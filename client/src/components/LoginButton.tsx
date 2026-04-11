const LoginButton = () => {
  const loginWithGitHub = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  return (
    <button
      onClick={loginWithGitHub}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
      }}
    >
      Login with GitHub
    </button>
  );
};

export default LoginButton;