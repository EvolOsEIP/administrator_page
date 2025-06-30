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
      throw new Error("Token is invalid or expired");
    }
    return true;
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
}