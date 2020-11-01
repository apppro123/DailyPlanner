import VasernDB from "./db";

const { ToDo, Group, Recurrence } = VasernDB;

export default VasernDB;
export { ToDo as ToDoDB, Group as GroupDB, Recurrence as RecurrenceDB };