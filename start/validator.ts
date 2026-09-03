/*
|--------------------------------------------------------------------------
| Validator file
|--------------------------------------------------------------------------
|
| The validator file is used for configuring global transforms for VineJS.
| The transform below converts all VineJS date outputs from JavaScript
| Date objects to Luxon DateTime instances, so that validated dates are
| ready to use with Lucid models and other parts of the app that expect
| Luxon DateTime.
|
*/

import { DateTime } from 'luxon'
import vine, { SimpleErrorReporter, VineDate } from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'

declare module '@vinejs/vine/types' {
  interface VineGlobalTransforms {
    date: DateTime
  }
}

VineDate.transform((value) => DateTime.fromJSDate(value))

/**
 * By default, an array member's error is reported under its concrete index
 * (e.g. "pictures.0"), so a template has no fixed key to look up when it
 * doesn't know in advance how many items will fail (see VineJS' error
 * reporter guide: https://vinejs.dev/docs/guides/error_reporter).
 *
 * Reporting array members under their wildcard path ("pictures.*") instead
 * gives every field a single, predictable key in the `inputErrorsBag`
 * flashed to the session. This only affects fields inside an array -
 * `field.wildCardPath` equals the regular field path everywhere else.
 */
class WildcardErrorReporter extends SimpleErrorReporter {
  report(message: string, rule: string, field: FieldContext, meta?: Record<string, unknown>) {
    super.report(message, rule, { ...field, getFieldPath: () => field.wildCardPath }, meta)
  }
}

vine.errorReporter = () => new WildcardErrorReporter()
