export const getRooms = (state) => state.forum.rooms || {};
export const getRoom = (state, roomId) => state.forum.rooms[roomId] || {};
export const getChats = (state) => state.forum.user_chats || {};