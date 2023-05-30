const permissions = {
  attendanceCreate: {
    type: Boolean,
    default: false,
  },
  attendanceList: {
    type: Boolean,
    default: false,
  },
  attendanceDetails: {
    type: Boolean,
    default: false,
  },
  attendanceUpdate: {
    type: Boolean,
    default: false,
  },
  attendanceDelete: {
    type: Boolean,
    default: false,
  },
};

module.exports = permissions;
