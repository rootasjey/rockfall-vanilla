var azure = require('azure-storage');
var uuid = require('node-uuid');

module.exports = Table;

function Table(storageClient, tableName, partitionKey) {
  this.storageClient = storageClient;
  this.tableName = tableName;
  this.partitionKey = partitionKey;
  this.storageClient.createTableIfNotExists(tableName, function tableCreated(error) {
    if(error) {
      throw error;
    }
  });
}

Table.prototype = {
  find: function(query, callback) {
    self = this;
    self.storageClient.queryEntities(query, function entitiesQueried(error, entities) {
      if(error) {
        callback(error);
      } else {
        callback(null, entities);
      }
    });
  },

  addItem: function(item, callback) {
    self = this;
    item.RowKey = uuid();
    item.PartitionKey = self.partitionKey;
    item.completed = false;
    self.storageClient.insertEntity(self.tableName, item, function entityInserted(error) {
      if(error){
        callback(error);
      }
      callback(null);
    });
  },

  updateItem: function(item, callback) {
    self = this;
    self.storageClient.queryEntity(self.tableName, self.partitionKey, item, function entityQueried(error, entity) {
      if(error) {
        callback(error);
      }
      entity.completed = true;
      self.storageClient.updateEntity(self.tableName, entity, function entityUpdated(error) {
        if(error) {
          callback(error);
        }
        callback(null);
      });
    });
  }
};
