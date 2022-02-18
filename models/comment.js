module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', { // MySQL에는 comments 테이블 생성
  // id가 기본적으로 들어있다.
  content: {
    type: DataTypes.TEXT,
    allowNull: false,  // 필수
  },
}, {
  // user 모델에 대한 세팅 (mb4 - 이모티콘을 위함)
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci', // 한글 저장
});
  Comment.associate = (db) => {
    // comment는 user에 속해 있다. 
    db.Comment.belongsTo(db.User);
    // comment는 post에 속해 있다. 
    db.Comment.belongsTo(db.Post);
  };
  return Comment;
};