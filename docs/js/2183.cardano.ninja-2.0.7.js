
$(function()
{
  
	if (window.location.protocol == 'http:')
	{
		window.location.href = window.location.href.replace('http', 'https')
	}
	else
	{	
        $('.smoothscroll').on('click', function (e) {
            var target = this.hash,
            $target    = $(target);
            
                e.preventDefault();
                e.stopPropagation();

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, 800, 'swing').promise().done(function () {

                window.location.hash = target;
            });
        });

        window.app =
        {
            controller: entityos._util.controller.code,
            vq: entityos._util.view.queue,
            get: entityos._util.data.get,
            set: entityos._util.data.set,
            invoke: entityos._util.controller.invoke,
            add: entityos._util.controller.add,
            show: entityos._util.view.queue.show
        };

        entityos._util.controller.invoke('cardano-ninja-init');
    }
});

entityos._util.controller.add(
{
    name: 'cardano-ninja-init',
    code: function ()
    {
        $.ajax(
        {
            type: 'GET',
            url: 'https://raw.githubusercontent.com/selfdriven-octo/cardano-ninja/main/data/cardano-ninja.json',
            cors: false,
            cache: false,
            dataType: 'json',
            success: function(data)
            {
                var alertsView = app.vq.init({queue: 'ninja-view'});
                var alerts = data.cardano.ninja.alerts.data;

                if (alerts != undefined)
                {
                    alertsView.add('<ul>');

                    _.each(alerts, function (alert)
                    {
                        alertsView.add(
                        [
                            '<li class="mt-2">',
                                '<div class="fw-bold">', alert.title, '</div>',
                                '<div class="text-secondary small">', alert.description, '</div>',
                            '</li>'
                        ]);
                    });

                    alertsView.add('</ul>');

                    alertsView.render('#cardano-ninja-alert-view');
                }
            },
            error: function (data) {}			
        });
    }
});

entityos._util.controller.add(
{
    name: 'cardano-ninja-blacklists',
    code: function ()
    {
        $.ajax(
        {
            type: 'GET',
            url: 'https://raw.githubusercontent.com/adabox-aio/cardano-shield/main/config/blacklist.json',
            cors: false,
            cache: false,
            dataType: 'json',
            success: function(data)
            {
                var blacklistsView = app.vq.init({queue: 'ninja-blacklists-view'});
             
                if (data != undefined)
                {
                    var dataKeys = Object.keys(data.policies).reverse();
					var blacklists = {};

					dataKeys.forEach(key => {
						blacklists[key] = data.policies[key];
					});

                    blacklistsView.add(
                    [
                        '<ul class="nav nav-tabs myds-tab">',
							'<li class="nav-item">',
								'<a class="nav-link active lead fw-bold text-danger" data-toggle="tab" href="#cardano-ninja-blacklists-tokens">',
									'<i class="fe fe-disc"></i><span class="ms-2 d-none d-md-inline">SPAM Tokens</span>',
								'</a>',
							'</li>',
							'<li class="nav-item">',
								'<a class="nav-link lead fw-bold text-danger" data-toggle="tab" href="#cardano-ninja-blacklists-domains"',
									' data-controller="cardano-ninja-blacklists-domains">',
									'<i class="fe fe-monitor"></i><span class="ms-2 d-none d-md-inline">Fake Websites</span>',
								'</a>',
							'</li>',
						'</ul>'
                    ]);

                    blacklistsView.add(
                    [
                        '<div class="mt-3 mb-3 text-muted" style="padding-left: 16px;"><a href="https://www.cardanoshield.com/" target="_blank" class="text-muted mb-3">Lists Provided By CardanoShield</a>',
                        ' | <a href="https://github.com/adabox-aio/cardano-shield/tree/main/config" target="_blank" class="text-muted mb-3">Source Data <i class="fe fe-external-link"></i></a>',
                        '</div>'
                    ]);

					blacklistsView.add(
                    [
					 	'<div class="tab-content">',
                        	'<div class="tab-pane active" id="cardano-ninja-blacklists-tokens">'
					]);

					blacklistsView.add(
                    [
                        '<div class="mt-3 mb-3 text-secondary fw-bold" style="padding-left: 16px;">',
							'A non-exhaustive list of known fake SPAM tokens that are airdropped to your wallet. These tokens have an embedded link that will lead you to fake website - see #3 in <em>Protect Yourself</em> section below.',
                        '</div>',

                        '<div class="mt-2 mb-3 text-secondary fw-bold" style="padding-left: 16px;">',
							'Most recent reported scams are first in the list.',
                        '</div>'
                    ]);

                    blacklistsView.add('<ul>');

                    _.each(blacklists, function (blacklistValue, blacklistKey)
                    {
                        blacklistsView.add(
                        [
                            '<li class="mt-2">',
                                '<div class="fw-bold">', blacklistKey, '</div>',
                                '<div ><a class="text-secondary small" href="https://cardanoscan.io/tokenPolicy/', blacklistValue, '" target="_blank">', blacklistValue, '</a></div>',
                            '</li>'
                        ]);
                    });

                    blacklistsView.add('</ul>');

					blacklistsView.add(
                    [
					 		'</div>',
					]);

					blacklistsView.add(
                    [
                        	'<div class="tab-pane" id="cardano-ninja-blacklists-domains">',
								'<div id="cardano-ninja-blacklists-domains-views">',
							'</div>',
						'</div>'
					]);

                    blacklistsView.render('#cardano-ninja-blacklists-view');
                }
            },
            error: function (data) {}			
        });
    }
});

entityos._util.controller.add(
{
    name: 'cardano-ninja-blacklists-domains',
    code: function ()
    {
        $.ajax(
        {
            type: 'GET',
            url: 'https://raw.githubusercontent.com/adabox-aio/cardano-shield/main/config/blacklist.json',
            cors: false,
            cache: false,
            dataType: 'json',
            success: function(data)
            {
                var blacklistDomainsView = app.vq.init({queue: 'ninja-blacklists-domains-view'});
                
                if (data != undefined)
                {
					//var blacklistDomains = _.sortBy(_.dropRight(_.split(data, '\n')));

                    var blacklistDomains = data.domains;

					blacklistDomainsView.add(
                    [
                        '<div class="mt-3 mb-3 text-secondary fw-bold" style="padding-left: 16px;">',
							'A non-exhaustive list of known fake scam websites.',
                        '</div>'
                    ]);

                    blacklistDomainsView.add('<ul>');

                    _.each(blacklistDomains, function (blacklistDomain, blacklistDomainIndex)
                    {
                        blacklistDomainsView.add(
                        [
                            '<li class="mt-2">',
                                '<div class="fw-bold">', blacklistDomain, '</div>',
                            '</li>'
                        ]);
                    });

                    blacklistDomainsView.add('</ul>');

					blacklistDomainsView.add(
                    [
					 		'</div>',
                        '</div>'
					]);

                    blacklistDomainsView.render('#cardano-ninja-blacklists-domains-views');
                }
            },
            error: function (data) {}			
        });
    }
});