import VasernDB from "./db";

const { ToDo, Group, Recurrence } = VasernDB;
const ToDoDB = VasernDB.get("ToDo");

export default VasernDB;
export { ToDoDB, Group as GroupDB, Recurrence as RecurrenceDB };