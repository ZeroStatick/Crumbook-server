const register = async (userData) => {
  const response = await fetch("/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(userData),
  });
  const response_body = await response.json();
  if (!response_body.success) {
    throw new Error(response_body.message);
  }
  localStorage.setItem("user_data", JSON.stringify(response_body.result));

  return response_body.result;
};

const login = async (userData) => {
  const response = await fetch("/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(userData),
  });
  const response_body = await response.json();
  if (!response_body.success) {
    throw new Error(response_body.message);
  }
  localStorage.setItem("user_data", JSON.stringify(response_body.result));

  return response_body.result;
};

const logout = () => {
  localStorage.removeItem("user_data");
};

module.exports = { register, login, logout };
