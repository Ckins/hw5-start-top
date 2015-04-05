// Generated by LiveScript 1.3.1
(function(){
  var s5RobotClickWithMessage, Robot, Button, addResettingWhenLeaveApb, addClickingHandlerToTheBubble, addClickingHandlerToAllButtons, addClickingToAHandler, addClickingToBHandler, addClickingToCHandler, addClickingToDHandler, addClickingToEHandler;
  $(function(){
    addClickingHandlerToAllButtons(function(){
      Robot.clickAtRandomOrder();
    });
    addClickingHandlerToTheBubble();
    addResettingWhenLeaveApb();
    return s5RobotClickWithMessage();
  });
  s5RobotClickWithMessage = function(){
    $('#button .apb').click(function(){
      var bubble, list, i$, ref$, len$, num;
      if (Robot.state === 'unclicked') {
        console.log("enter");
        Robot.shuffle();
        bubble = $('#info-bar');
        list = [];
        for (i$ = 0, len$ = (ref$ = Robot.sequence).length; i$ < len$; ++i$) {
          num = ref$[i$];
          list.push(Robot.charSequence[num]);
        }
        list.join(',');
        bubble.text(list);
        Robot.clickAtRandomOrder();
      }
    });
  };
  Robot = (function(){
    Robot.displayName = 'Robot';
    var prototype = Robot.prototype, constructor = Robot;
    Robot.buttons = $('#control-ring .button');
    Robot.bubble = $('#info-bar');
    Robot.sequence = [0, 1, 2, 3, 4];
    Robot.charSequence = ["A", "B", "C", "D", "E"];
    Robot.cursor = 0;
    Robot.state = 'unclicked';
    Robot.sum = 0;
    /* this function is used to start the click in-order as well as the callback function of a click*/
    Robot.clickAtRandomOrder = function(){
      if (this.cursor === this.sequence.length) {
        setTimeout(function(){
          Robot.bubble.click();
          $('#message-bar .saying').text("大气泡：楼主异步调用战斗力感人，目测不超过" + Robot.sum);
          $('#info-bar').text(Robot.sum);
        }, 0);
      } else {
        this.state = 'ran-clicked';
        setTimeout(function(){
          Robot.clickCurButtonAndGetNextRandomly().click();
        }, 800);
      }
    };
    Robot.shuffle = function(){
      return this.sequence.sort(function(){
        return 0.5 - Math.random();
      });
    };
    Robot.clickCurButtonAndGetNextRandomly = function(){
      var curRan;
      curRan = Robot.sequence[Robot.cursor++];
      return Robot.buttons[curRan];
    };
    Robot.getSum = function(){
      return Robot.sum;
    };
    function Robot(){}
    return Robot;
  }());
  Button = (function(){
    Button.displayName = 'Button';
    var prototype = Button.prototype, constructor = Button;
    Button.buttons = [];
    Button.disableUnclickedButtons = function(thisButton){
      var i$, ref$, len$, button, results$ = [];
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        button = ref$[i$];
        if (button !== thisButton && button.state !== 'done') {
          results$.push(button.disable());
        }
      }
      return results$;
    };
    Button.enableUnclickedButtons = function(thisButton){
      var i$, ref$, len$, button, results$ = [];
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        button = ref$[i$];
        if (button !== thisButton && button.state !== 'done') {
          results$.push(button.enable());
        }
      }
      return results$;
    };
    Button.allButtonIsDone = function(){
      var i$, ref$, len$, button;
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        button = ref$[i$];
        if (button.state !== 'done') {
          return false;
        }
      }
      return true;
    };
    Button.resetAll = function(){
      var i$, ref$, len$, button;
      for (i$ = 0, len$ = (ref$ = this.buttons).length; i$ < len$; ++i$) {
        button = ref$[i$];
        button.reset();
      }
    };
    function Button(dom, goodMessage, badMessage, callback){
      var this$ = this;
      this.dom = dom;
      this.goodMessage = goodMessage;
      this.badMessage = badMessage;
      this.callback = callback;
      this.state = 'enabled';
      this.currentSum = 0;
      this.redDot = this.dom.find('.unread');
      this.dom.click(function(){
        if (this$.state === 'enabled') {
          this$.constructor.disableUnclickedButtons(this$);
          this$.wait();
          this$.fetchNumberAndShow();
        }
      });
      this.constructor.buttons.push(this);
    }
    prototype.fetchNumberAndShow = function(){
      var this$ = this;
      $.get('/?timestamp=' + Math.random(), function(number, result){
        if (this$.state === 'waiting') {
          this$.redDot.text(number);
          this$.constructor.enableUnclickedButtons(this$);
          this$.currentSum += parseInt(number);
          this$.done();
          this$.bubbleCheck();
          this$.errorCheck(this$.currentSum);
        }
      });
    };
    prototype.errorCheck = function(number){
      var data, error;
      data = Math.random();
      error = data < 0.3;
      if (error) {
        this.showMessage(this.badMessage);
        if (Robot.state === 'ran-clicked') {
          return this.callback(true, this.currentSum, data);
        }
      } else {
        this.showMessage(this.goodMessage);
        if (Robot.state === 'ran-clicked') {
          return this.callback(false, this.currentSum, data);
        }
      }
    };
    prototype.bubbleCheck = function(){
      if (this.constructor.allButtonIsDone()) {
        $('#info-bar').addClass('blue').removeClass('grey');
        return $('#info-bar').click();
      }
    };
    prototype.showMessage = function(message){
      var mes;
      mes = $('#message-bar .saying');
      return mes.text(message);
    };
    prototype.disable = function(){
      this.state = 'disabled';
      this.dom.addClass('disabled');
    };
    prototype.enable = function(){
      this.state = 'enabled';
      this.dom.removeClass('disabled');
    };
    prototype.wait = function(){
      this.redDot.addClass('appear');
      this.state = 'waiting';
      this.dom.find('.unread').text('...');
      this.dom.addClass('disabled');
    };
    prototype.done = function(){
      this.state = 'done';
    };
    prototype.reset = function(){
      var mes;
      this.state = 'enabled';
      this.dom.removeClass('disabled');
      this.dom.find('.unread').text('').removeClass('appear');
      mes = $('#message-bar .saying');
      mes.text('');
    };
    return Button;
  }());
  addResettingWhenLeaveApb = function(){
    $('#bottom-positioner').on('mouseleave', function(event){
      var bubble2;
      Button.resetAll();
      bubble2 = $('#info-bar');
      bubble2.text('');
      Robot.cursor = 0;
      Robot.state = 'unclicked';
    });
  };
  addClickingHandlerToTheBubble = function(){
    var bubble;
    bubble = $('#info-bar');
    bubble.removeClass('blue').addClass('grey');
    bubble.click(function(){
      if (bubble.hasClass('blue')) {
        bubble.removeClass('blue').addClass('grey');
      }
    });
  };
  addClickingHandlerToAllButtons = function(nextStep){
    addClickingToAHandler(function(){
      nextStep();
    });
    addClickingToBHandler(function(){
      nextStep();
    });
    addClickingToCHandler(function(){
      nextStep();
    });
    addClickingToDHandler(function(){
      nextStep();
    });
    addClickingToEHandler(function(){
      nextStep();
    });
  };
  addClickingToAHandler = function(nextStep){
    var buttons, goodMessage, badMessage, aButton;
    buttons = $('#control-ring .button');
    goodMessage = 'A;这是个天大的秘密';
    badMessage = 'A:这不是个天大的秘密';
    aButton = new Button($(buttons[0]), goodMessage, badMessage, function(error, number, data){
      if (error) {
        console.log("A:error!");
      } else {
        console.log("A:ran_success");
      }
      Robot.sum += number;
      if (typeof nextStep == 'function') {
        nextStep();
      }
    });
  };
  addClickingToBHandler = function(nextStep){
    var buttons, goodMessage, badMessage, bButton;
    buttons = $('#control-ring .button');
    goodMessage = 'B :我不知道';
    badMessage = 'B :我知道';
    bButton = new Button($(buttons[1]), goodMessage, badMessage, function(error, number, data){
      if (error) {
        console.log("B :error!");
      } else {
        console.log("B : ran_success");
      }
      Robot.sum += number;
      if (typeof nextStep == 'function') {
        nextStep();
      }
    });
  };
  addClickingToCHandler = function(nextStep){
    var buttons, goodMessage, badMessage, cButton;
    buttons = $('#control-ring .button');
    goodMessage = 'C;你不知道';
    badMessage = 'C:你知道';
    cButton = new Button($(buttons[2]), goodMessage, badMessage, function(error, number, data){
      if (error) {
        console.log("C:error!");
      } else {
        console.log("C:ran_success");
      }
      Robot.sum += number;
      if (typeof nextStep == 'function') {
        nextStep();
      }
    });
  };
  addClickingToDHandler = function(nextStep){
    var buttons, goodMessage, badMessage, dButton;
    buttons = $('#control-ring .button');
    goodMessage = 'D;他不知道';
    badMessage = 'D:他不知道';
    dButton = new Button($(buttons[3]), goodMessage, badMessage, function(error, number, data){
      if (error) {
        console.log("D:error!");
      } else {
        console.log("D:ran_success");
      }
      Robot.sum += number;
      if (typeof nextStep == 'function') {
        nextStep();
      }
    });
  };
  addClickingToEHandler = function(nextStep){
    var buttons, goodMessage, badMessage, eButton;
    buttons = $('#control-ring .button');
    goodMessage = 'E:才怪';
    badMessage = 'E:才不怪';
    eButton = new Button($(buttons[4]), goodMessage, badMessage, function(error, number, data){
      if (error) {
        console.log("E:error!");
      } else {
        console.log("E:ran_success");
      }
      Robot.sum += number;
      if (typeof nextStep == 'function') {
        nextStep();
      }
    });
  };
}).call(this);