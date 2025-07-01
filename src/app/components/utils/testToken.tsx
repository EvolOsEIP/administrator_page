export default async function checkToken() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/auth/test`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("res: ", res);
    if (!res.ok) {
      if (res.status === 403) {
        localStorage.removeItem("token"); // Clear invalid token
        return false; // Token is invalid or request failed 
      } else {
        throw new Error(`Network response was not ok: ${res.statusText}`);
    }
  }
    return true;
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
}