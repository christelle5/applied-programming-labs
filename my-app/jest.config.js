module.exports = {
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|sass)$":
        "D:/Навчання/Calendar/my-app/__mocks__/fileMock.js",
    },


    testEnvironment: "jsdom",
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    transformIgnorePatterns: [
      "node_modules/(?!(axios|react-toastify))",
      "/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.js$",
      "/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.ts$",
      "/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.tsx$",
    ],
    collectCoverageFrom: [
      "src/components/Login.js",
      "src/components/Signup.js",
      "src/components/Add_event.js",
      "src/components/Add_participant.js",
      "src/components/Calendar.js",
      "src/components/Delete_user.js",
      "src/components/Edit_event.js",
      "src/components/Edit_user.js",
      "src/components/Event_cr.js",
    ],
    setupFilesAfterEnv: [
      "D:/Навчання/Calendar/my-app/setupTests.js",
    ],
  };