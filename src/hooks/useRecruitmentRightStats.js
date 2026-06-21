import { useState, useEffect } from "react";
import { getUser } from "../utils/tokenManager";
import { getUserPosts } from "../services/postsApi";
import { getConnections } from "../services/connectionsApi";

export default function useRecruitmentRightStats() {
  const [userData, setUserData] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [connectionCount, setConnectionCount] = useState(0);

  useEffect(() => {
    const user = getUser();
    if (!user) return;

    setUserData(user);

    getUserPosts(user.id, 100)
      .then((data) => {
        setPostCount(data.posts?.length || 0);
      })
      .catch((err) => console.error("Error fetching posts:", err));

    getConnections(1, 1)
      .then((data) => {
        const total = data?.pagination?.total;
        setConnectionCount(
          typeof total === "number" ? total : data.connections?.length || 0,
        );
      })
      .catch((err) => console.error("Error fetching connections:", err));
  }, []);

  return { userData, postCount, connectionCount };
}
