const debug = require('debug')('mattermoster:model-mm-todo');

const todo = require('./todo');
const getHelpText = require('../utils/get-help-text');

class MmTodo {
  constructor(i18n) {
    this.i18n = i18n;
  }

  async do(mmData) {
    this.resetMmResp();  // reset this.mmRes (Mattermost response object)
    this.mmRes.token = mmData.token;
    this.user_name = mmData.user_name;
    this.channel_id = mmData.channel_id;

    let mmRes = null;
    let cmdObj = this.processCommandString(mmData.text);

    switch (cmdObj.command) {
      case this.i18n.__('cmd_new_1'):
      case this.i18n.__('cmd_new_2'):
      case this.i18n.__('cmd_new_3'):
        return await this.cmdNew(cmdObj);

      case this.i18n.__('cmd_new_nc_1'):
      case this.i18n.__('cmd_new_nc_2'):
      case this.i18n.__('cmd_new_nc_3'):
        mmRes = await this.cmdNew(cmdObj);
        mmRes.response_type = 'ephemeral';
        return mmRes;

      case this.i18n.__('cmd_modify_1'):
      case this.i18n.__('cmd_modify_2'):
      case this.i18n.__('cmd_modify_3'):
        return await this.cmdModify(cmdObj);

      case this.i18n.__('cmd_pending_1'):
      case this.i18n.__('cmd_pending_2'):
      case this.i18n.__('cmd_pending_3'):
        return await this.cmdPending();

      case this.i18n.__('cmd_pending_channel_1'):
      case this.i18n.__('cmd_pending_channel_2'):
      case this.i18n.__('cmd_pending_channel_3'):
        mmRes = await this.cmdPending();
        mmRes.response_type = 'in_channel';
        return mmRes;

      case this.i18n.__('cmd_all_1'):
      case this.i18n.__('cmd_all_2'):
      case this.i18n.__('cmd_all_3'):
        return await this.cmdAll();

      case this.i18n.__('cmd_all_channel_1'):
      case this.i18n.__('cmd_all_channel_2'):
      case this.i18n.__('cmd_all_channel_3'):
        mmRes = await this.cmdAll();
        mmRes.response_type = 'in_channel';
        return mmRes;

      case this.i18n.__('cmd_done_1'):
      case this.i18n.__('cmd_done_2'):
      case this.i18n.__('cmd_done_3'):
        return await this.cmdDone(cmdObj);

      case this.i18n.__('cmd_undone_1'):
      case this.i18n.__('cmd_undone_2'):
      case this.i18n.__('cmd_undone_3'):
        return await this.cmdUndone(cmdObj, true);

      case this.i18n.__('cmd_remove_1'):
      case this.i18n.__('cmd_remove_2'):
      case this.i18n.__('cmd_remove_3'):
        return await this.cmdRemove(cmdObj);

      default:
        this.mmRes.text = getHelpText(this.i18n);
        return this.mmRes;
    }
  }

  async cmdAll() {
    let list = await todo.getList(this.channel_id);
    this.mmRes.text = this.markdownTodoList(list);
    return this.mmRes;
  }

  async cmdPending() {
    let incomplete_only = true;
    let list = await todo.getList(this.channel_id, incomplete_only);
    this.mmRes.text = this.markdownTodoList(list);
    return this.mmRes;
  }

  async cmdNew(cmdObj) {
    let todoObj = {
      channel_id: this.channel_id,
      description: cmdObj.param ? `${cmdObj.param} ${cmdObj.text}` : cmdObj.text,
      created_by: this.user_name,
      updated_by: this.user_name,
      completed: 0,
    }

    let result = await todo.create(todoObj);

    this.mmRes.response_type = 'in_channel';
    return this.cmdPending();
  }

  async cmdDone(cmdObj, undone) {
    let todoObjChg = {
      id: cmdObj.param,
      completed: !undone,
      updated_by: this.user_name,
    }

    if (cmdObj.text) {
      let todoObjArr = await todo.get(cmdObj.param);
      let todoObj = todoObjArr[0];
      todoObjChg.description = `${todoObj.description} :memo: _${cmdObj.text}_`;
    }

    let result = await todo.update(todoObjChg);

    this.mmRes.response_type = 'in_channel';
    return this.cmdPending();
  }

  async cmdUndone(cmdObj) {
    return this.cmdDone(cmdObj, true);
  }

  async cmdModify(cmdObj) {
    let todoObj = {
      id: cmdObj.param,
      description: cmdObj.text,
      updated_by: this.user_name,
    }

    let result = await todo.update(todoObj);

    this.mmRes.response_type = 'in_channel';
    return this.cmdPending();
  }

  async cmdRemove(cmdObj) {
    let result = await todo.delete(cmdObj.param);
    return this.cmdPending();
  }

  resetMmResp() {
    this.mmRes = {
      'response_type': 'ephemeral',
      'username': this.i18n.__('Todo Manager'),
      'token': null,
    };
  }

  processCommandString(str) {
    let cmdObj = {
      command: '',
      param: null,
      text: null
    };

    if (str) {
      let strArr = str.split(' ');
      cmdObj.command = strArr.shift();

      // If there is remaining text in string command
      if (strArr.length > 0) {
        if (!isNaN(strArr[0])) {
          cmdObj.param = strArr.shift();
        }
        cmdObj.text = strArr.join(' ');
      }
    }

    debug(cmdObj);
    return cmdObj;
  }

  markdownTodoList(todoArr) {
    const moment = require('moment');
    const locale = this.i18n.getLocale();
    moment.locale(locale);

    if (!todoArr.length) return this.i18n.__("There's no pending ToDo's!") + ' :smiley:';

    let todoTxtArr = [];
    todoArr.forEach((todo) => {
      let checkbox = todo.completed ? '[x]' : '[ ]';
      let todoTxt = `- ${checkbox} *#${todo.id}* - ${todo.description}`
      let meta = '';
      let relTime = null;
      if (todo.completed) {
        relTime = moment(todo.updated).fromNow();
        meta = `\`${this.i18n.__('Completed')} ${relTime} ${this.i18n.__('by')} @${todo.updated_by}\``;
      } else {
        let createdOn = +moment(todo.created);
        let updatedOn = +moment(todo.updated);
        if (createdOn !== updatedOn) {
          relTime = moment(todo.updated).fromNow();
          meta = `\`${this.i18n.__('Modified')} ${relTime} ${this.i18n.__('by')} @${todo.updated_by}>\``;
        } else {
          relTime = moment(todo.created).fromNow();
          meta = `\`${this.i18n.__('Created')} ${relTime} ${this.i18n.__('by')} @${todo.created_by}>\``;
        }
      }
      todoTxt += ` ${meta}`;
      todoTxtArr.push(todoTxt);
    });

    return todoTxtArr.join('\n');
  }
}

module.exports = MmTodo;