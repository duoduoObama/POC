import { css, html } from "lit";

import { Component } from "../../types/Component";
import { IQcolorOptions } from "./IQColor";
import { customElement, property } from "lit/decorators.js";
import {
  IEventSpecificationEvent,
  IMessage,
  ISchema,
  IDOMEventMeta,
  IWatchSetting,
} from "../../types/IComponent";
import { cloneDeep, isArray, isObject, isString } from "lodash-es";
import { domAssemblyCustomEvents } from "../../util/base-method";
