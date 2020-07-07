/*
 *  Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.apimgt.notification;

import com.google.gson.Gson;
import org.apache.commons.lang.StringUtils;
import org.wso2.carbon.apimgt.impl.APIConstants;
import org.wso2.carbon.apimgt.impl.publishers.RevocationRequestPublisher;
import org.wso2.carbon.apimgt.notification.event.TokenRevocationEvent;

import java.util.Properties;

public class DefaultKeyManagerEventHandlerImpl extends AbstractKeyManagerEventHandler {

    private RevocationRequestPublisher revocationRequestPublisher;

    public DefaultKeyManagerEventHandlerImpl() {

        revocationRequestPublisher = RevocationRequestPublisher.getInstance();
    }

    @Override
    public boolean handleEvent(String event) {

        if (StringUtils.isNotEmpty(event) && event.contains(APIConstants.NotificationEvent.TOKEN_REVOCATION_EVENT)) {
            handleTokenRevocationEvent(event);
        }
        return true;
    }

    @Override
    public String getType() {

        return APIConstants.KeyManager.DEFAULT_KEY_MANAGER_TYPE;
    }

    private boolean handleTokenRevocationEvent(String event) {

        TokenRevocationEvent tokenRevocationEvent = new Gson().fromJson(event, TokenRevocationEvent.class);
        Properties properties = new Properties();
        properties.setProperty(APIConstants.NotificationEvent.EVENT_ID, tokenRevocationEvent.getEventId());
        properties.put(APIConstants.NotificationEvent.CONSUMER_KEY, tokenRevocationEvent.getConsumerKey());
        properties.put(APIConstants.NotificationEvent.TOKEN_TYPE, tokenRevocationEvent.getTokenType());
        properties.put(APIConstants.NotificationEvent.TENANT_ID, tokenRevocationEvent.getTenantId());
        properties.put(APIConstants.NotificationEvent.TENANT_DOMAIN, tokenRevocationEvent.getTenantDomain());
        revocationRequestPublisher.publishRevocationEvents(tokenRevocationEvent.getAccessToken(),
                tokenRevocationEvent.getExpiryTime(), properties);
        return true;
    }
}
