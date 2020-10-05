let price = 10;

$('.price--button').click(function (event) {
    let amount = $(this).data('amount');
    if (isNaN(amount)) {
        return;
    } else if (amount === 'other') {
        return;
    }

    event.preventDefault();
    if (amount >= 5) {
        price = amount;

        $('.price--button').each(function (i, target) {
            $(target).removeClass('activated');
        });

        $(this).addClass('activated');
    }
});

$('.submit--button').click(function (event) {
    event.preventDefault();

    let mode = $(this).data('mode');
    let recurring = $(this).data('recurring');

    if (mode === 'modal') {
        let customPrice = $('#custom-price').val();
        if (isNaN(customPrice)) {
            return;
        } else if (customPrice < 5) {
            return;
        }

        price = customPrice;
        $('#custom-price-modal').modal('hide');
    } else {
        $('.submit--button').each(function (i, target) {
            let targetMode = $(this).data('mode');
            if (targetMode !== 'modal') {
                $(target).removeClass('activated');
            }
        });
        $(this).addClass('activated');
    }

    $('#redirect-modal').modal({ backdrop: 'static', keyboard: false });

    setTimeout(function () {
        let redirect = 'https://secure.pl-ips.org/payments/paywall/' + price + '/'.concat(recurring ? 'recurring' : 'onetime');
        $.redirect(redirect, {
            callback: 'https://secure.pl-ips.org/thank-you',
            fallback: `https://secure.pl-ips.org/failed`
        });
    }, 2000);
});

$('#custom-price-modal').on('shown.bs.modal', function () {
    $('#custom-price').focus();
})

$('.team .person').click(function (event) {
    let element = event.currentTarget;

    let modal = $(element).find('.modal');
    if (modal != null) {
        $(modal).modal({ backdrop: 'static', keyboard: false });
    }
});

let TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
    let i = this.loopNum % this.toRotate.length;
    let fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    let that = this;
    let delta = 300 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

function navbar() {
    let height = $(window).scrollTop();

    if (height > 0) {
        lastHeight = height;
        $("#navbar").removeClass("navbar-start").addClass("navbar-standard");
    } else {
        $("#navbar").removeClass("navbar-standard").addClass("navbar-start");
    }

    $("#navbar").css("transform", "translateY(0)");

    $(window).scroll(function () {
        let height = $(window).scrollTop();

        if ($("#navbar-toggler").hasClass("collapsed")) {
            if (height > 0) {
                $("#navbar").removeClass("navbar-start").addClass("navbar-standard");
            } else {
                $("#navbar").removeClass("navbar-standard").addClass("navbar-start");
            }
        }

        lastHeight = height;
    });

    $(window).resize(function() {
        let width = $(window).width();

        if (width >= 991 && !$("#navbar-toggler").hasClass("collapsed")) {
            $("#navbar-toggler").click();
        }

        lastWidth = width;
    });

    $("#navbar-toggler").on('click', function () {
        let height = $(window).scrollTop();

        if (height <= 0) {
            if ($("#navbar-toggler").hasClass("collapsed")) {
                $("#navbar").removeClass("navbar-start").addClass("navbar-standard");
            } else {
                $("#navbar").removeClass("navbar-standard").addClass("navbar-start");
            }
        }

        lastHeight = height;
    });
}

function cookies() {
    let status = Cookies.get("ipsplorg-cookies-policy");
    if (status == null) {
        $('#cookies-modal').modal("show");
    }

    $('#cookies-button').on('click', function() {
        Cookies.set("ipsplorg-cookies-policy", 'true', {
            expires: 30
        });
    });
}

window.onload = function() {
    navbar();
    cookies();

    let css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #db1a1a; font-size: 2.5rem; font-weight: 700; }";
    document.body.appendChild(css);

    let elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
        let toRotate = elements[i].getAttribute('data-rotate');

        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), 1500);
        }
    }
};