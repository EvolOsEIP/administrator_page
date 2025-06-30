export default function checkToken() {
  try {
    const res = fetch(`${localStorage.getItem('token')}/api/test`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) {
      throw new Error("Token is invalid or expired");
    }
    return true;
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
}