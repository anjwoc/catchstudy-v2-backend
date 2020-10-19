'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('users', 'socialType', {
      type: Sequelize.STRING(200),
    });
    
    
  },

  down: (queryInterface, Sequelize) => {
    // return[
    //   queryInterface.removeColumn('users', 'socialType'),
    //   queryInterface.removeColumn('users', 'openId'),
      
    // ]
  }
};
