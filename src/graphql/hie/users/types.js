module.exports = `
extend type HieRoot {
  users: Users
}

type Users {  
  count(startDate: String, endDate: String, organization: String): [UsersCount]
  list(month: Int, year: Int, organization: String): [UsersList]
}

type UsersCount {
  month: Int
  year: Int
  total: Int
  cumulative: Int
}

type UsersList {
  user_name: String
  organization: String
  address: String
  country: String
  created: String
}

`;
