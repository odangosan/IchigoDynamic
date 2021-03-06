var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationsName;
(function (AnimationsName) {
    AnimationsName.CHOP = "chop";
    AnimationsName.STANDBY = "standby";
    AnimationsName.BROKEN = "broken";
})(AnimationsName || (AnimationsName = {}));
var SpriteSheetName;
(function (SpriteSheetName) {
    SpriteSheetName.ICHOGO = "ichigo";
    SpriteSheetName.AKARI = "akari";
    SpriteSheetName.LOG = "log";
})(SpriteSheetName || (SpriteSheetName = {}));
var ImageName;
(function (ImageName) {
    ImageName.BG_FOREST = "background:forest";
    ImageName.SHADOW = "shadow";
})(ImageName || (ImageName = {}));
var SoundName;
(function (SoundName) {
    SoundName.CHOP = "chop";
    SoundName.CHOP_1 = "chop_1";
    SoundName.CHOP_2 = "chop_2";
})(SoundName || (SoundName = {}));
var State;
(function (State) {
    State.CHOPPER = "chopper:solo";
    State.BOOT = "boot";
    State.CHOPPER_PAIR = "chopper:pair";
    State.CHOPPER_PAIR_SOUNDS = "chopper:pair:s";
})(State || (State = {}));
var BaseState = (function (_super) {
    __extends(BaseState, _super);
    function BaseState() {
        _super.apply(this, arguments);
    }
    BaseState.prototype.preload = function () {
        this.game.load.bitmapFont("Pixeled", "assets/fonts/bitmapfonts/pixeled_0.png", "assets/fonts/bitmapfonts/pixeled.fnt");
        this.game.load.spritesheet(SpriteSheetName.ICHOGO, "assets/images/いちごちゃんsprite.png", 128, 128);
        this.game.load.spritesheet(SpriteSheetName.AKARI, "assets/images/あかりちゃんsprite.png", 128, 128);
        this.game.load.image(ImageName.BG_FOREST, "assets/images/background_forest.png");
        this.game.load.image(ImageName.SHADOW, "assets/images/shadow.png");
        this.game.load.spritesheet(SpriteSheetName.LOG, "assets/images/薪単品sprite.png", 112, 64);
        this.game.load.audio(SoundName.CHOP, "assets/sounds/kick-low1.mp3");
    };
    BaseState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.game.stage.backgroundColor = "#eee";
        document.body.oncontextmenu = function () {
            return false;
        };
        this.game.stage.disableVisibilityChange = true;
        this.game.add.bitmapText(250, 180, "Pixeled", "- " + this.game.state.current + " -", 20);
    };
    BaseState.prototype.pad = function (n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };
    return BaseState;
}(Phaser.State));
var Chopper = (function (_super) {
    __extends(Chopper, _super);
    function Chopper() {
        _super.apply(this, arguments);
        this.count = 0;
    }
    Chopper.prototype.preload = function () {
        _super.prototype.preload.call(this);
    };
    Chopper.prototype.init = function (count) {
        this.count = count;
    };
    Chopper.prototype.getPaddingCount = function () {
        return this.pad(this.count + "", 19, "");
    };
    Chopper.prototype.createLOG = function () {
        var logY = 130;
        var LOG = this.game.add.sprite(0, logY, SpriteSheetName.LOG);
        LOG.x = (this.game.width - LOG.width) / 2 + 10;
        var t = this.game.add.tween(LOG).from({
            y: 0
        }, 80, null, false, 0, 0, false);
        LOG.animations.add(AnimationsName.BROKEN, [0, 0, 0, 0, 0, 1, 2, 3, 4, 5], 40, false)
            .onComplete.add(function () {
            LOG.destroy();
        });
        t.start();
        return LOG;
    };
    Chopper.prototype.create = function () {
        var _this = this;
        this.chopSound = this.game.add.audio(SoundName.CHOP, 0.25, false);
        var bg = this.game.add.image(0, 0, ImageName.BG_FOREST);
        bg.inputEnabled = true;
        bg.input.useHandCursor = true;
        this.counter = this.game.add.bitmapText(13, 10, "Pixeled", this.getPaddingCount(), 40);
        this.shadow = this.game.add.sprite(0, 130, ImageName.SHADOW);
        this.shadow.x = (this.game.width - this.shadow.width) / 2 - 47;
        this.ichigo = this.game.add.sprite(0, 60, SpriteSheetName.ICHOGO);
        this.ichigo.scale.setTo(-1, 1);
        this.ichigo.x = (this.game.width - this.ichigo.width) / 2 - 25;
        this.ichigo.animations.add(AnimationsName.STANDBY, [0, 1, 2, 1], 3, true);
        this.ichigo.animations.add(AnimationsName.CHOP, [3, 4, 5, 6, 7, 8, 9, 10, 11], 35, false).onComplete.add(function () {
            _this.ichigo.animations.play(AnimationsName.STANDBY);
            _this.LOG = _this.createLOG();
        });
        bg.events.onInputDown.add(function (p) {
            if (!p.game.input.activePointer.leftButton.isDown)
                return;
            if (_this.ichigo.animations.currentAnim.name == AnimationsName.CHOP) {
                _this.ichigo.animations.currentAnim.complete();
            }
            _this.ichigo.animations.play(AnimationsName.CHOP);
            _this.count++;
            _this.counter.setText(_this.getPaddingCount());
            if (_this.LOG.animations.currentAnim.isPlaying) {
                _this.LOG.animations.currentAnim.complete();
            }
            _this.chopSound.play();
            _this.LOG.play(AnimationsName.BROKEN);
        });
        this.ichigo.animations.play(AnimationsName.STANDBY);
        this.LOG = this.createLOG();
        _super.prototype.create.call(this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.addOnce(function () {
            _this.game.state.start(State.CHOPPER_PAIR_SOUNDS, true, false, _this.count);
        });
        this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.addOnce(function () {
            _this.game.state.start(State.CHOPPER_PAIR, true, false, _this.count);
        });
    };
    return Chopper;
}(BaseState));
"use strict";
var Boot = (function (_super) {
    __extends(Boot, _super);
    function Boot() {
        _super.apply(this, arguments);
    }
    Boot.prototype.preload = function () {
        this.game.load.bitmapFont("Pixeled", "assets/fonts/bitmapfonts/pixeled_0.png", "assets/fonts/bitmapfonts/pixeled.fnt");
        this.game.load.spritesheet(SpriteSheetName.ICHOGO, "assets/images/いちごちゃんsprite.png", 128, 128);
        this.game.load.spritesheet(SpriteSheetName.AKARI, "assets/images/あかりちゃんsprite.png", 128, 128);
        this.game.load.image(ImageName.BG_FOREST, "assets/images/background_forest.png");
        this.game.load.image(ImageName.SHADOW, "assets/images/shadow.png");
        this.game.load.spritesheet(SpriteSheetName.LOG, "assets/images/薪単品sprite.png", 112, 64);
        this.game.load.audio(SoundName.CHOP, "assets/sounds/kick-low1.mp3");
    };
    Boot.prototype.create = function () {
        this.game.state.start(State.CHOPPER, true, false, 0);
    };
    return Boot;
}(Phaser.State));
var ChopperPair = (function (_super) {
    __extends(ChopperPair, _super);
    function ChopperPair() {
        _super.apply(this, arguments);
        this.count = 0;
    }
    ChopperPair.prototype.init = function (count) {
        this.count = count;
    };
    ChopperPair.prototype.preload = function () {
        _super.prototype.preload.call(this);
    };
    ChopperPair.prototype.getPaddingCount = function () {
        return this.pad(this.count + "", 19, "");
    };
    ChopperPair.prototype.createLOG = function () {
        var logY = 130;
        var LOG = this.game.add.sprite(0, logY, SpriteSheetName.LOG);
        LOG.x = (this.game.width - LOG.width) / 2 + 10;
        var t = this.game.add.tween(LOG).from({
            y: 0
        }, 80, null, false, 0, 0, false);
        LOG.animations.add(AnimationsName.BROKEN, [0, 0, 0, 0, 0, 1, 2, 3, 4, 5], 40, false)
            .onComplete.add(function () {
            LOG.destroy();
        });
        t.start();
        return LOG;
    };
    ChopperPair.prototype.create = function () {
        var _this = this;
        this.chopSound = this.game.add.audio(SoundName.CHOP, 0.25, false);
        var bg = this.game.add.image(0, 0, ImageName.BG_FOREST);
        bg.inputEnabled = true;
        bg.input.useHandCursor = true;
        this.counter = this.game.add.bitmapText(13, 10, "Pixeled", this.getPaddingCount(), 40);
        this.shadowIchigo = this.game.add.sprite(0, 130, ImageName.SHADOW);
        this.shadowIchigo.x = (this.game.width - this.shadowIchigo.width) / 2 - 47;
        this.ichigo = this.game.add.sprite(0, 60, SpriteSheetName.ICHOGO);
        this.ichigo.scale.setTo(-1, 1);
        this.ichigo.x = (this.game.width - this.ichigo.width) / 2 - 25;
        this.ichigo.animations.add(AnimationsName.STANDBY, [0, 1, 2, 1], 3, true);
        this.ichigo.animations.add(AnimationsName.CHOP, [3, 4, 5, 6, 7, 8, 9, 10, 11], 35, false).onComplete.add(function () {
            _this.ichigo.animations.play(AnimationsName.STANDBY);
            _this.LOG = _this.createLOG();
        });
        this.shadowAkari = this.game.add.sprite(0, 130, ImageName.SHADOW);
        this.shadowAkari.x = (this.game.width - this.shadowAkari.width) / 2 + 40;
        this.akari = this.game.add.sprite(0, 60, SpriteSheetName.AKARI);
        this.akari.x = (this.game.width - this.akari.width) / 2 + 20;
        this.akari.animations.add(AnimationsName.STANDBY, [0, 1, 2, 1], 3, true);
        this.akari.animations.add(AnimationsName.CHOP, [3, 4, 5, 6, 7, 8, 9, 10, 11], 35, false).onComplete.add(function () {
            _this.akari.animations.play(AnimationsName.STANDBY);
            _this.LOG = _this.createLOG();
        });
        bg.events.onInputDown.add(function (p) {
            if (_this.currentChopper.animations.currentAnim.name == AnimationsName.CHOP) {
                _this.currentChopper.animations.currentAnim.complete();
            }
            if (_this.currentChopper.animations.currentAnim.name == AnimationsName.CHOP) {
                _this.currentChopper.animations.currentAnim.complete();
            }
            if (p.game.input.activePointer.leftButton.isDown) {
                _this.ichigo.animations.play(AnimationsName.CHOP);
                _this.currentChopper = _this.ichigo;
            }
            else if (p.game.input.activePointer.rightButton.isDown) {
                _this.akari.animations.play(AnimationsName.CHOP);
                _this.currentChopper = _this.akari;
            }
            _this.count++;
            _this.counter.setText(_this.getPaddingCount());
            if (_this.LOG.animations.currentAnim.isPlaying) {
                _this.LOG.animations.currentAnim.complete();
            }
            _this.chopSound.play();
            _this.LOG.play(AnimationsName.BROKEN);
        });
        this.ichigo.animations.play(AnimationsName.STANDBY);
        this.akari.animations.play(AnimationsName.STANDBY);
        this.currentChopper = this.ichigo;
        this.LOG = this.createLOG();
        _super.prototype.create.call(this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.addOnce(function () {
            _this.game.state.start(State.CHOPPER, true, false, _this.count);
        });
        this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.addOnce(function () {
            _this.game.state.start(State.CHOPPER_PAIR_SOUNDS, true, false, _this.count);
        });
    };
    return ChopperPair;
}(BaseState));
var ChopperPairSounds = (function (_super) {
    __extends(ChopperPairSounds, _super);
    function ChopperPairSounds() {
        _super.apply(this, arguments);
        this.count = 0;
    }
    ChopperPairSounds.prototype.init = function (count) {
        this.count = count;
    };
    ChopperPairSounds.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.game.load.audio(SoundName.CHOP_1, "assets/sounds/vipsz3_snd7218.wav");
        this.game.load.audio(SoundName.CHOP_2, "assets/sounds/vipsz3_snd7211.wav");
    };
    ChopperPairSounds.prototype.getPaddingCount = function () {
        return this.pad(this.count + "", 19, "");
    };
    ChopperPairSounds.prototype.createLOG = function () {
        var logY = 130;
        var LOG = this.game.add.sprite(0, logY, SpriteSheetName.LOG);
        LOG.x = (this.game.width - LOG.width) / 2 + 10;
        var t = this.game.add.tween(LOG).from({
            y: 0
        }, 80, null, false, 0, 0, false);
        LOG.animations.add(AnimationsName.BROKEN, [0, 0, 0, 0, 0, 1, 2, 3, 4, 5], 40, false)
            .onComplete.add(function () {
            LOG.destroy();
        });
        t.start();
        return LOG;
    };
    ChopperPairSounds.prototype.create = function () {
        var _this = this;
        this.chopSound = this.game.add.audio(SoundName.CHOP, 0.25, false);
        this.chopSound_1 = this.game.add.audio(SoundName.CHOP_1, 0.9, false);
        this.chopSound_2 = this.game.add.audio(SoundName.CHOP_2, 0.6, false);
        var bg = this.game.add.image(0, 0, ImageName.BG_FOREST);
        bg.inputEnabled = true;
        bg.input.useHandCursor = true;
        this.counter = this.game.add.bitmapText(13, 10, "Pixeled", this.getPaddingCount(), 40);
        this.shadowIchigo = this.game.add.sprite(0, 130, ImageName.SHADOW);
        this.shadowIchigo.x = (this.game.width - this.shadowIchigo.width) / 2 - 47;
        this.ichigo = this.game.add.sprite(0, 60, SpriteSheetName.ICHOGO);
        this.ichigo.scale.setTo(-1, 1);
        this.ichigo.x = (this.game.width - this.ichigo.width) / 2 - 25;
        this.ichigo.animations.add(AnimationsName.STANDBY, [0, 1, 2, 1], 3, true);
        this.ichigo.animations.add(AnimationsName.CHOP, [3, 4, 5, 6, 7, 8, 9, 10, 11], 35, false).onComplete.add(function () {
            _this.ichigo.animations.play(AnimationsName.STANDBY);
            _this.LOG = _this.createLOG();
        });
        this.shadowAkari = this.game.add.sprite(0, 130, ImageName.SHADOW);
        this.shadowAkari.x = (this.game.width - this.shadowAkari.width) / 2 + 40;
        this.akari = this.game.add.sprite(0, 60, SpriteSheetName.AKARI);
        this.akari.x = (this.game.width - this.akari.width) / 2 + 20;
        this.akari.animations.add(AnimationsName.STANDBY, [0, 1, 2, 1], 3, true);
        this.akari.animations.add(AnimationsName.CHOP, [3, 4, 5, 6, 7, 8, 9, 10, 11], 35, false).onComplete.add(function () {
            _this.akari.animations.play(AnimationsName.STANDBY);
            _this.LOG = _this.createLOG();
        });
        bg.events.onInputDown.add(function (p) {
            if (_this.currentChopper.animations.currentAnim.name == AnimationsName.CHOP) {
                _this.currentChopper.animations.currentAnim.complete();
            }
            if (_this.currentChopper.animations.currentAnim.name == AnimationsName.CHOP) {
                _this.currentChopper.animations.currentAnim.complete();
            }
            if (p.game.input.activePointer.leftButton.isDown) {
                _this.ichigo.animations.play(AnimationsName.CHOP);
                _this.chopSound_2.play();
                _this.currentChopper = _this.ichigo;
            }
            else if (p.game.input.activePointer.rightButton.isDown) {
                _this.akari.animations.play(AnimationsName.CHOP);
                _this.chopSound_1.play();
                _this.currentChopper = _this.akari;
            }
            _this.count++;
            _this.counter.setText(_this.getPaddingCount());
            if (_this.LOG.animations.currentAnim.isPlaying) {
                _this.LOG.animations.currentAnim.complete();
            }
            _this.LOG.play(AnimationsName.BROKEN);
        });
        this.ichigo.animations.play(AnimationsName.STANDBY);
        this.akari.animations.play(AnimationsName.STANDBY);
        this.currentChopper = this.ichigo;
        this.LOG = this.createLOG();
        _super.prototype.create.call(this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.addOnce(function () {
            _this.game.state.start(State.CHOPPER_PAIR, true, false, _this.count);
        });
        this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.addOnce(function () {
            _this.game.state.start(State.CHOPPER, true, false, _this.count);
        });
    };
    return ChopperPairSounds;
}(BaseState));
var Application = (function () {
    function Application(width, height, targetId) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, targetId, null, false);
        this.game.state.add(State.CHOPPER, Chopper, false);
        this.game.state.add(State.CHOPPER_PAIR, ChopperPair, false);
        this.game.state.add(State.CHOPPER_PAIR_SOUNDS, ChopperPairSounds, false);
        this.game.state.add(State.BOOT, Boot, false);
        this.game.state.start(State.BOOT);
    }
    return Application;
}());
var main = new Application(400, 200, "canvas");
console.log("This id is '" + main.game.id + "'!");
