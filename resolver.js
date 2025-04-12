function an() {
  Args.url = 'https://bid-summer.ms.cs7777.vk.com/profile/';

  var resolvedScreenName = API.resolveScreenName(Args);

  var result = {
    type: resolvedScreenName.type,
    object_id: resolvedScreenName.object_id,
  };

  return result;
}

const tr = {
  "response": {
    "type": null,
    "object_id": null
  }
}

function t() {
  if (resolvedScreenName) {
    if (
      resolvedScreenName.type == 'application' ||
      resolvedScreenName.type == 'community_application' ||
      resolvedScreenName.type == 'vk_app' ||
      resolvedScreenName.type == 'internal_vkui'
    ) {
      var app = API.apps.get({
        app_id: resolvedScreenName.object_id,
        extended: 1,
        platform: 'ios',
        ref: Args.ref,
        ref_id: Args.ref_id,
        url: Args.url,
      }).items[0];

      if (app) {
        result.object = app;
        if (app.placeholder_info == null && (app.is_in_catalog == 0 || app.type == 'html5_game')) {
          result.embedded_uri = API.apps.getEmbeddedUrl({
            app_id: result.object_id,
            owner_id: result.group_id,
            url: Args.url,
            ref: Args.ref,
          });
          return result;
        } else if (Args.url) {
          result.embedded_url = { view_url: Args.url };
        }
      } else {
        var placeholder_info = API.apps.getAppPlaceholderInfo({
          app_id: resolvedScreenName.object_id,
        });
        if (placeholder_info) {
          app = placeholder_info;
          app.id = resolvedScreenName.object_id;
          if (placeholder_info.app_type) {
            app.type = placeholder_info.app_type;
          } else {
            app.type = 'mini_app';
          }
          app.webview_url = ''; //needs to be set (non nil) for correct client work

          result.object = app;
          result.type = 'vk_app';
        }

        if (Args.url) {
          result.embedded_url = { view_url: Args.url };
        }
      }
    }
  }
}

function test() {
}
