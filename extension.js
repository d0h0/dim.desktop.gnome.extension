/*
 * Dim Screen
 *
 * Based on the code from https://wiki.gnome.org/Projects/GnomeShell/Extensions/StepByStepTutorial#myFirstExtension
 *
 * by d0h0@tuta.io (20161027)
 */
const St = imports.gi.St; //Gobject-Introspection https://developer.gnome.org/gobject/stable/
const Main = imports.ui.main; //Main.layoutManager.monitor https://developer.gnome.org/gtk3/stable/
const Tweener = imports.ui.tweener;

let text, button;

let currentOpacity = 10;

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function _showHello() {
    let monitor = Main.layoutManager.primaryMonitor;
    //let monitor2 = Main.layoutManager.secondaryMonitor;
    let myText = "Info: Monitor w:h=" + monitor.width + "/" + monitor.height + " ... x:y=" + monitor.x + "/" + monitor.y+ " | CurrentOpacity: " + currentOpacity;
    //myText = "hi 2: " + monitor2.x;

    if (!text) {
        text = new St.Label({
                        style_class: 'helloworld-label',
                        text: myText
                        });
        Main.uiGroup.add_actor(text);
    } else {
        _hideHello();
    }

    global.log("DIM: currentOpacity = " + currentOpacity);

    text.opacity = currentOpacity;

//    text.set_position(monitor.x + Math.floor(monitor.width / 2 - text.width / 2),
//                      monitor.y + Math.floor(monitor.height / 2 - text.height / 2));

    text.set_position(0, 0); //override
    text.set_width(monitor.width * 6); //simply give enough width
    text.set_height(monitor.height * 6);

//    Tweener.addTween(text,
//                     { opacity: 0,
//                       time: 20,
//                       transition: 'easeOutQuad',
//                       onComplete: _hideHello });
}

// change opacity when scrolled
function _changeOpacity() {
    if(currentOpacity < 25) {
        currentOpacity = currentOpacity - 1;
        if(currentOpacity < 1) currentOpacity = 250;
    } else {
        currentOpacity = currentOpacity - 5;
    }
    _showHello();
}

// reset opacity when clicked
function _resetAndShowHello() {
    currentOpacity = 100;
    _showHello();
}

function init() {
    global.log("test"); //https://smasue.github.io/gnome-shell-tw

    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });

    //usr/share/icons/gnome/scalable/actions/system-run-symbolic.svg
    let icon = new St.Icon({ icon_name: 'dialog-information-symbolic',
                             style_class: 'panelItem' }); //system-status-icon
    button.set_child(icon);

    button.connect('button-press-event', _resetAndShowHello);
    button.connect('scroll-event', _changeOpacity);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
