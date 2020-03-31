const DB = "mongodb";
const DBAddress = "localhost";
const DBPort = "27017";
const DBName = "TimesPayDB";

export default {
  DB: DB,
  DBAddress: DBAddress,
  DBPort: DBPort,
  DBName: DBName,
  DBConnectionString: `${DB}://${DBAddress}:${DBPort}/${DBName}`,
}
const mode = "DEV";
export const BaseURL = mode == "DEV" ? "http://localhost:3000/api" : ""
