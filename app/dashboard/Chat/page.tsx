import { getUserFromToken } from "@/app/api/read-token/route";
import ChatComponent from "@/app/components/ChatComponent";

export default async function Chatpage(){
  
  const user = await getUserFromToken();
  if (!user) {
    return <div>User not found.</div>;
  }
  return (
    <div>
      <ChatComponent currentUser={user.sub} />
    </div>
  );
}