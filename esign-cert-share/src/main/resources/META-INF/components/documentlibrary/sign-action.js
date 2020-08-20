(function() {
	YAHOO.Bubbling.fire("registerAction", {
		actionName : "onActionSign",
		fn : function sign_action(record, owner) {
			
			var params = this.getAction(record, owner).params;
			
			if (record.node.aspects.indexOf("sign:signerUsernames") != -1 || record.node.aspects.indexOf("sign_signerUsernames") != -1) {
				var property = record.node.properties["sign:signerUsernamesList"];
				if (!property)
					property = record.node.properties["sign_signerUsernamesList"];
				if(property) {
					var propertyParts = property.split(",");
					var userHasAlreadySignedDocument = propertyParts.indexOf(Alfresco.constants.USERNAME) != -1;
					if(userHasAlreadySignedDocument) {
						Alfresco.util.PopupManager.displayMessage({
							text : this.msg("message.sign-action.already-signed"),
							displayTime : 5
						});
						return;
					}
				}
			}
			
			this.widgets.waitDialog = Alfresco.util.PopupManager.displayMessage({
				text : this.msg("document.loading"),
				spanClass : "wait",
				displayTime : 0
			});
			
			this.widgets.signDialog = new Alfresco.module.SimpleDialog("signDialog").setOptions({
				width : "30em",
				templateUrl : Alfresco.constants.URL_SERVICECONTEXT + "keensoft/sign/sign-dialog?nodeRef=" + record.nodeRef + "&mimeType=" + params["mimeType"],
				actionUrl : Alfresco.constants.PROXY_URI + "keensoft/sign/save-sign?real_username=" + Alfresco.constants.USERNAME,
				destroyOnHide : true,
				onSuccess : {
					fn : function signDialog_successCallback(response) {
						Alfresco.util.PopupManager.displayMessage({
							text : this.msg("message.sign-action.success"),
							displayTime : 3
						});
                        //YAHOO.Bubbling.fire("metadataRefresh");
						setTimeout(function(){
							window.location.reload();
						}, 3000);
					},
					scope : this
				},
				onFailure : {
					fn : function signDialog_failCallback(response) {
						this.widgets.signDialog.hide();
						Alfresco.util.PopupManager.displayMessage({
							text : this.msg("message.sign-action.failure"),
							displayTime : 3
						});						
					},
					scope : this
				},
				doBeforeDialogShow : {
					fn : function beforeSign_dialogShow(response) {
						this.widgets.waitDialog.destroy();
					},
					scope : this
				}
			});

			this.widgets.signDialog.show();
		}
	});
})();
