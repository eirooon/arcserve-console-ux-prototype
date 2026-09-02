import { http, HttpResponse } from "msw";

/**
 * Builds GET/POST/PUT/DELETE handlers for one resource, backed by an
 * in-memory copy of its seed fixture. State resets on page reload, which is
 * fine for a design prototype with no real backend yet.
 */
export function createCrudHandlers(endpoint, seedData) {
  let records = [...seedData];

  return [
    http.get(endpoint, () => HttpResponse.json(records)),

    http.post(endpoint, async ({ request }) => {
      const body = await request.json();
      const record = { ...body, id: crypto.randomUUID() };
      records = [...records, record];
      return HttpResponse.json(record, { status: 201 });
    }),

    http.put(`${endpoint}/:id`, async ({ params, request }) => {
      const body = await request.json();
      const index = records.findIndex((record) => String(record.id) === params.id);
      if (index === -1) {
        return HttpResponse.json({ message: "Not found" }, { status: 404 });
      }
      records[index] = { ...records[index], ...body, id: records[index].id };
      return HttpResponse.json(records[index]);
    }),

    http.delete(`${endpoint}/:id`, ({ params }) => {
      const index = records.findIndex((record) => String(record.id) === params.id);
      if (index === -1) {
        return HttpResponse.json({ message: "Not found" }, { status: 404 });
      }
      records = records.filter((record) => String(record.id) !== params.id);
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}
