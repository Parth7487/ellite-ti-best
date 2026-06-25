
    (function() {
      var preconnectOrigins = ["https://cdn.shopify.com"];
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills.Cwf7UO8Y.js","/cdn/shopifycloud/checkout-web/assets/c1/app.BV1WzZr9.js","/cdn/shopifycloud/checkout-web/assets/c1/esnext-vendor.ktvhigxw.js","/cdn/shopifycloud/checkout-web/assets/c1/context-browser.CYOaerfG.js","/cdn/shopifycloud/checkout-web/assets/c1/types-UnauthenticatedErrorModalPayload.Cqw_yZoy.js","/cdn/shopifycloud/checkout-web/assets/c1/images-payment-icon.DsjjwgBl.js","/cdn/shopifycloud/checkout-web/assets/c1/phone-phoneCountryCode.DyYerqu2.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-PaymentSessionMutation.DSAXqZs0.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-shop-discount-offer.D3zbuB5y.js","/cdn/shopifycloud/checkout-web/assets/c1/types-index.BRzBf3WI.js","/cdn/shopifycloud/checkout-web/assets/c1/consent-manager-shared.DOW-tkzt.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShopPayCheckoutGqlVersion.MihKn_Mk.js","/cdn/shopifycloud/checkout-web/assets/c1/helpers-installmentsNotSupportedForAddress.DSMkEo1L.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-ShopPayCheckoutSessionQuery.F-nx4U1A.js","/cdn/shopifycloud/checkout-web/assets/c1/utils-getCommonShopPayExternalTelemetryAttributes.fESt6av-.js","/cdn/shopifycloud/checkout-web/assets/c1/graphql-UserPrivacySettingsSetMutation.D99dQi3t.js","/cdn/shopifycloud/checkout-web/assets/c1/extensions-remote-dom.DR7bGN_u.js","/cdn/shopifycloud/checkout-web/assets/c1/extensions-rpc.CQMgCJpN.js","/cdn/shopifycloud/checkout-web/assets/c1/hydrate.Cyam_vsU.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-en.C7CPf_05.js","/cdn/shopifycloud/checkout-web/assets/c1/page-OnePage.BBBsQjiL.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useWalletsTimeout.CYFPZHc8.js","/cdn/shopifycloud/checkout-web/assets/c1/remember-me-hooks.CjAUjV29.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useUnauthenticatedErrorModal.UOnxjJGk.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useStableHostMethodsReferences.D5xGwjuz.js","/cdn/shopifycloud/checkout-web/assets/c1/OffsitePaymentFailed.D05m3Zb3.js","/cdn/shopifycloud/checkout-web/assets/c1/SplitDeliveryMerchandiseContainer.Dpg6NnNT.js","/cdn/shopifycloud/checkout-web/assets/c1/useShopPayButtonClassName.CwDV4NGU.js","/cdn/shopifycloud/checkout-web/assets/c1/NotFound.CruGP4XB.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useReplaceShopPayInHistory.BrwqikGN.js","/cdn/shopifycloud/checkout-web/assets/c1/ChangeCompanyLocationLink.B6BRo2Dj.js","/cdn/shopifycloud/checkout-web/assets/c1/WalletsSandbox-WalletSandbox.CYsl6hBP.js","/cdn/shopifycloud/checkout-web/assets/c1/BillingAddressForm.cg9u-a8T.js","/cdn/shopifycloud/checkout-web/assets/c1/PhoneField.1K2iOeum.js","/cdn/shopifycloud/checkout-web/assets/c1/images-flag-icon.C_eXYJRt.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useCanChangeCompanyLocation.DvhcTHFW.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-usePostPurchase.gouMCzgw.js","/cdn/shopifycloud/checkout-web/assets/c1/Choice.BVWiGMxI.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useForceShopPayUrl.D50dmpEj.js","/cdn/shopifycloud/checkout-web/assets/c1/GooglePayButton-index.76teHEcw.js","/cdn/shopifycloud/checkout-web/assets/c1/MarketsProDisclaimer.D4i-Lkc_.js","/cdn/shopifycloud/checkout-web/assets/c1/CompactChoiceList.HcPhpIky.js","/cdn/shopifycloud/checkout-web/assets/c1/AutocompleteField-hooks.CnRJR6bA.js","/cdn/shopifycloud/checkout-web/assets/c1/LocalizationExtensionField.BrMcHXIR.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShopPayPaymentRequiredMethod.C1pvfUrJ.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useUpdateCheckoutAddress.C1TBU_Vs.js","/cdn/shopifycloud/checkout-web/assets/c1/billing-address-hooks.BJ7cSGUT.js","/cdn/shopifycloud/checkout-web/assets/c1/WalletLogo.CK_M8aaH.js","/cdn/shopifycloud/checkout-web/assets/c1/PaymentLine.D6imRDbN.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useGeneralPaymentErrorMessage.YTBxjFIw.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShowShopPayOptin.CWOFmAOg.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShowCreateMoreAccountsGdprTreatment.CJLUAGzm.js","/cdn/shopifycloud/checkout-web/assets/c1/NumberField.Ch9-_5L8.js","/cdn/shopifycloud/checkout-web/assets/c1/Section.CRDP7FZN.js","/cdn/shopifycloud/checkout-web/assets/c1/MobileOrderSummary.DwSPE3e4.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useOnePageFormSubmit.BksUw0Xr.js","/cdn/shopifycloud/checkout-web/assets/c1/PayPalOverCaptureInfoBanner.C7F8PxYi.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-get-negotiation-input.lo3_UVpY.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-useShopCashCheckoutEligibility.onJ0aJfh.js","/cdn/shopifycloud/checkout-web/assets/c1/redemption-constants.Cu2A-vp8.js","/cdn/shopifycloud/checkout-web/assets/c1/BillingAddressSelector.z6s7qtkW.js","/cdn/shopifycloud/checkout-web/assets/c1/PaymentErrorBanner.DFK2Nny7.js","/cdn/shopifycloud/checkout-web/assets/c1/StockProblems-StockProblemsLineItemList.CCiLfEYh.js","/cdn/shopifycloud/checkout-web/assets/c1/DutyOptions.BhdS65Re.js","/cdn/shopifycloud/checkout-web/assets/c1/ShipmentBreakdown.DBWmiZmn.js","/cdn/shopifycloud/checkout-web/assets/c1/MerchandiseModal.BeX_U4cn.js","/cdn/shopifycloud/checkout-web/assets/c1/extension-targets-shipping-options.BVuLNgED.js","/cdn/shopifycloud/checkout-web/assets/c1/StackedMerchandisePreview.C7C_8aup.js","/cdn/shopifycloud/checkout-web/assets/c1/EstimatedDeliveryContent.BFOgarU_.js","/cdn/shopifycloud/checkout-web/assets/c1/DeliveryMacros-index.fmoE-TZW.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingMethodSelector.CtofWXMi.js","/cdn/shopifycloud/checkout-web/assets/c1/TextArea.Dm2B5OWs.js","/cdn/shopifycloud/checkout-web/assets/c1/SubscriptionPriceBreakdown.Dncte6Qh.js","/cdn/shopifycloud/checkout-web/assets/c1/hooks-usePaypalRowEffects.D65CnUGj.js","/cdn/shopifycloud/checkout-web/assets/c1/Switch.Db_xgiIL.js","/cdn/shopifycloud/checkout-web/assets/c1/Middot.qJE23gui.js","/cdn/shopifycloud/checkout-web/assets/c1/ShippingGroupsSummaryLine.BPXkSUS3.js","/cdn/shopifycloud/checkout-web/assets/c1/utilities-publishMessage.CXQrF-kK.js"];
      var styles = ["/cdn/shopifycloud/checkout-web/assets/c1/assets/app.CMvjny27.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/UnauthenticatedErrorModalPayload.CNIOrkH0.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/phoneCountryCode.C-ppsiYq.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ButtonWithRegisterWebPixel.BMlKV7hn.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OnePage.CQM_ODoE.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/SplitDeliveryMerchandiseContainer.D_EbuoqI.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/LocalizationExtensionField.D0wnWgTu.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/MobileOrderSummary.CqVkJv9Z.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useOnePageFormSubmit.CtCAWdWo.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/WalletLogo.CIy8uDiZ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Choice.BSntDI5A.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ChangeCompanyLocationLink.uqpm88mq.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/CompactChoiceList.BEvzDDvy.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Section.CU18S7Ap.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShopPayButtonClassName.BrcQzLuH.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentLine.Bu4GN9Lb.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/DutyOptions.LcqrKXE1.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/NotFound.0LqF4awG.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Switch.Dq_6Ius6.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/BillingAddressForm.Dj0n4Opx.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PhoneField.DN6CUyst.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Middot.D7Ujmshx.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/EstimatedDeliveryContent.Dl_bEC_c.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PayPalOverCaptureInfoBanner.CuS5ve3d.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/usePostPurchase.uv-X4L1-.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/WalletSandbox.CnR7qNLY.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/NumberField.CRpcZnVJ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShippingMethodSelector.B0hio2RO.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/SubscriptionPriceBreakdown.vTcdVGq4.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/StackedMerchandisePreview.D6OuIVjc.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0842/8362/1657/files/9e6b3da2-db01-42fa-86c1-46530a57ac3d_x320.png?v=1738219760"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = preconnectOrigins.concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  