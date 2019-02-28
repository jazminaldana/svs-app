window.hashChange = false;
window.args = {};

class Services {
    static init(callback) {
        window.args = this.getArgs();

        this.log("Initilize App");

        callback();

        window.onhashchange = () => {
            if (!window.hashChange) {
                callback();
            }

            window.hashChange = false;
        };
    }

    static log(val, critical) {
        if (window.debug || critical) {
            if (typeof val === "object") {
                console.log(JSON.stringify(val, null, 4));
            } else {
                console.log(val);
            }
        }
    }

    static getArgs() {
        return this.parseJson(this.base64.decodeUrl(window.location.hash.replace(/#/i, "")));
    }

    static setArgs() {
        window.hashChange = true;

        if (window.args && typeof window.args === "object") {
            window.location.hash = `#${this.base64.encodeUrl(JSON.stringify(window.args))}`;
        } else {
            window.location.hash = "";
        }

        this.log(window.location);
    }

    static parseJson(value) {
        if (/^[\],:{}\s]*$/.test(value.replace(/\\["\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
            try {
                return JSON.parse(value);
            } catch (err) {
                return {};
            }
        }

        return {};
    }

    static layoutDashboard(app) {
        let container = app.parent();
        let saftey = 0;

        while (container.attr("id") !== "Dashboard" && saftey < 20) {
            container.css({
                height: "100%"
            });

            container = container.parent();
            saftey += 1;
        }
    }

    static date = {
        today() {
            const date = new Date();
    
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
    
            return date;
        },

        format(value) {
            return `${value.getMonth() + 1}/${value.getDate()}/${value.getFullYear()}`;
        },

        addDays(date, days) {
            const value = new Date(date);
    
            value.setDate(value.getDate() + days);
    
            return value;
        },

        first(date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        },

        last(date) {
            const value = new Date(date);

            value.setMonth(value.getMonth + 1);

            return this.addDays(this.first(value), -1);
        },

        sunday(date) {
            const day = new Date(date);
    
            return new Date(day.setDate(day.getDate() - day.getDay() + (day.getDay() === 0 ? -6 : 1) - 1));
        },

        fullDayName(day) {
            switch (day % 7) {
                case 1:
                    return "Monday";
    
                case 2:
                    return "Tuesday";
    
                case 3:
                    return "Wednesday";
    
                case 4:
                    return "Thursday";
    
                case 5:
                    return "Friday";
    
                case 6:
                    return "Saturday";
    
                default:
                    return "Sunday";
            }
        },

        dayName(day) {
            return this.fullDayName(day).substring(0, 3);
        },

        fullMonthName(month) {
            switch (month % 12) {
                case 1:
                    return "February";
    
                case 2:
                    return "March";
    
                case 3:
                    return "April";
    
                case 4:
                    return "May";
    
                case 5:
                    return "June";
    
                case 6:
                    return "July";
    
                case 7:
                    return "August";
    
                case 8:
                    return "September";
    
                case 9:
                    return "October";
    
                case 10:
                    return "November";
    
                case 11:
                    return "December";
    
                default:
                    return "January";
            }
        },

        monthName(month) {
            return this.fullMonthName(month).substring(0, 3);
        }
    }

    static time = {
        format(value) {
            const minutes = value.getMinutes();
            const hours = value.getHours();

            return `${hours % 12 ? hours % 12 : 12}:${minutes < 10 ? `0${minutes}` : minutes} ${hours >= 12 ? "PM" : "AM"}`;
        },

        cacheTime() {
            const date = new Date();
    
            return `${window.svs.date.format(date)} ${this.format(date)}`;
        }
    }

    static base64 = {
        encode(value) {
            if (!value || value === "") {
                return "";
            }

            return btoa(value);
        },

        encodeUrl(value) {
            if (!value || value === "") {
                return "";
            }

            return btoa(value).replace(/\//g, "_").replace(/\+/g, "-");
        },

        decode(value) {
            if (!value || value === "") {
                return "";
            }

            return atob(value);
        },

        decodeUrl(value) {
            if (!value || value === "") {
                return "";
            }

            return atob(value.replace(/_/g, "/").replace(/-/g, "+"));
        }
    }

    static trigger = {
        tab(action) {
            $(`#svs-app-main .svs-tabs .svs-tab[action='${action}']`).click();
        }
    }

    static enable = {
        tabs(callback) {
            $("#svs-app-main .svs-tabs").unbind("click").on("click", ".svs-tab", (e) => {
                const tab = $(e.currentTarget);

                tab.parent().find(".svs-tab").removeClass("svs-active");
                tab.addClass("svs-active");

                const action = tab.attr("action");

                if (action && action !== "") {
                    window.args.action = action;
                    window.svs.log(`Action: ${action}`);

                    callback(action);
                }
            });
        },

        panels() {
            if (!window.args.panel) {
                window.args.panel = {}
            }
    
            if (!window.args.panel.west || Number.isNaN(parseFloat(window.args.panel.west))) {
                window.args.panel.west = 350;
            }
    
            if (!window.args.panel.east || Number.isNaN(parseFloat(window.args.panel.east))) {
                window.args.panel.east = 350;
            }

            $("#svs-app-main .svs-resizable-west").width(window.args.panel.west).resizable({
                handles: "e",
                stop: (event, ui) => {
                    window.args.panel.west = ui.size.width;
                }
            });

            $("#svs-app-main .svs-resizable-east").width(window.args.panel.east).resizable({
                handles: "w",
                stop: (event, ui) => {
                    window.args.panel.east = ui.size.width;
                }
            });
        }
    }
}

window.svs = Services;

$(() => {
    $(document).trigger("appload");
});
