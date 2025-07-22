package es.keensoft.alfresco.util;

import java.util.Properties;

import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;

public class Common {

    public static NodeRef getSignatureNodeContainer(final NodeService nodeService, final Properties properties) {
        final String signatureNodeContainerProperty = properties.getProperty("esign.signature_node_container");
		if (signatureNodeContainerProperty != null && !signatureNodeContainerProperty.isEmpty() &&
			NodeRef.isNodeRef(signatureNodeContainerProperty) && nodeService.exists(new NodeRef(signatureNodeContainerProperty))) {
			return new NodeRef(signatureNodeContainerProperty);
		}
        return null;
    }
}