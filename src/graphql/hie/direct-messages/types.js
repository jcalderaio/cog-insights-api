module.exports = `
extend type HieRoot {
    directMessages(year: Int, month: Int): [HieDirectMessageStats]
    directMessagesByOrganization(startDate: String, endDate: String, organization: String): [HieDirectMessagesByOrganization]
    directMessagesByUser(startDate: String, endDate: String, organization: String): [HieDirectMessagesByUser]
    directMessagesAggregate(startDate: String, endDate: String, organization: String): [HieDirectMessagesAggregate]
}

scalar Date

type HieDirectMessageStats {
  month: Int
  year: Int
  totalAccounts: Int
  accountsCreatedThisMonth: Int
  activeAccounts:Int
  ratioActiveAccounts: Int
  totalUsers: Int
  totalMessagesSentOON: Int
  totalMessagesThisMonth: Int
  totalMessagesThisYear: Int
}

type HieDirectMessagesByOrganization {
  date: Date
  month: Int
  year: Int
  organization: String
  messagesDelivered: Int
  messagesOriginated: Int
  messagesReceived: Int
}

type HieDirectMessagesAggregate {
  date: Date
  month: Int
  year: Int
  messagesDelivered: Int
  messagesOriginated: Int
  messagesReceived: Int
}

type HieDirectMessagesByUser {
  date: Date
  month: Int
  year: Int
  messagesSent: Int
  user: String
  organization: String
}

`;
