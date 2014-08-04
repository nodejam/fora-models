// Generated by CoffeeScript 1.6.3
(function() {
	var _;

	var Database, Mongo, thunkify,
		__bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	Mongo = require('mongodb');

	thunkify = require('fora-node-thunkify');

	Database = (function() {
		function Database(conf) {
			var Parser, _ref;
			this.conf = conf;
			this.setRowId = __bind(this.setRowId, this);
			this.getRowId = __bind(this.getRowId, this);
			this.setupIndexes = __bind(this.setupIndexes, this);
			this.deleteDatabase = __bind(this.deleteDatabase, this);
			this.remove = __bind(this.remove, this);
			this.findOne = __bind(this.findOne, this);
			this.find = __bind(this.find, this);
			this.count = __bind(this.count, this);
			this.updateAll = __bind(this.updateAll, this);
			this.update = __bind(this.update, this);
			this.insert = __bind(this.insert, this);
			this.getDb = __bind(this.getDb, this);
			switch (this.conf.type) {
				case 'mongodb':
					Parser = require('./backends/mongodb');
					this.db = new Parser(this.conf);
					this.rowId = (_ref = this.conf.rowId) !== null ? _ref : '_id';
			}
		}

		Database.prototype.getDb = function*() {
			return yield* this.db.getDb();
		};

		Database.prototype.insert = function*(typeDefinition, document) {
			return yield* this.db.insert(typeDefinition, document);
		};

		Database.prototype.update = function*(typeDefinition, query, document) {
			return yield* this.db.update(typeDefinition, query, document);
		};

		Database.prototype.updateAll = function*(typeDefinition, query, document) {
			return yield* this.db.updateAll(typeDefinition, query, document);
		};

		Database.prototype.count = function*(typeDefinition, query) {
			return yield* this.db.count(typeDefinition, query);
		};

		Database.prototype.find = function*(typeDefinition, query, options) {
			return yield* this.db.find(typeDefinition, query, options);
		};

		Database.prototype.findOne = function*(typeDefinition, query, options) {
			return yield* this.db.findOne(typeDefinition, query, options);
		};

		Database.prototype.remove = function*(typeDefinition, query) {
			return yield* this.db.remove(typeDefinition, query);
		};

		Database.prototype.deleteDatabase = function*() {
			return yield* this.db.deleteDatabase();
		};

		Database.prototype.setupIndexes = function*() {
			return yield* this.db.setupIndexes();
		};

		Database.prototype.getRowId = function(obj) {
			var _ref;
			return (_ref = obj[this.rowId]) !== null ? _ref.toString() : void 0;
		};

		Database.prototype.setRowId = function(obj, val) {
			if (val) {
				if (typeof val === 'string') {
					val = this.db.ObjectId(val);
				}
				obj[this.rowId] = val;
			}
			return obj;
		};

		return Database;

	})();

	module.exports = Database;

}).call(this);