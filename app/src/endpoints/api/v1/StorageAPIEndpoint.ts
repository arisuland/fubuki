/**
 * ☔ Arisu: Translation made with simplicity, yet robust.
 * Copyright (C) 2020-2021 Noelware
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { FastifyReply, FastifyRequest } from 'fastify';
import StorageProviderService from '~/core/services/StorageProviderService';
import { Endpoint, Route } from '~/core';
import type { File } from '~/storage';
import { Inject } from '@augu/lilith';
import { Logger } from 'tslog';

// import library to include typings
import 'fastify-multipart';

type StorageDetailRequest = FastifyRequest<{
  Params: {
    user: string;
    project: string;
  };
}>;

@Endpoint('/api/v1/storage')
export default class StorageAPIEndpoint {
  @Inject
  private readonly storage!: StorageProviderService;

  @Inject
  private readonly logger!: Logger;

  @Route('/', 'GET')
  async get(_: FastifyRequest, reply: FastifyReply) {
    return reply.status(404).send({
      message: 'Route /api/v1/storage requires a `user` and `project` path param.',
    });
  }

  @Route('/:user/:project', 'GET')
  async storageDetails(req: StorageDetailRequest, reply: FastifyReply) {
    const { user, project } = req.params;
    if (this.storage.provider.getMetadata === undefined)
      return reply
        .type('application/json')
        .status(503)
        .send({
          message: `Service Unavailable: Provider ${this.storage.provider['constructor'].name
            .replace('Storage', '')
            .replace('Provider', '')} cannot retrieve project resources.`,
        });

    try {
      await this.storage.provider.getMetadata(`${user}/${project}`);
    } catch (ex) {
      if ((ex as any).code !== undefined && (ex as any).code === 'ENOENT')
        return reply
          .type('application/json')
          .status(404)
          .send({
            message: `Project ${user}/${project} resources was not found.`,
          });

      this.logger.fatal(`Unable to receive project resources (${user}/${project}):`, ex);
      return reply.type('application/json').status(500).send({
        message: 'Unable to receive project resources. Try again later?',
      });
    }

    const metadata = await this.storage.provider.getMetadata(`${user}/${project}`);
    if (metadata.directory !== undefined) delete metadata.directory;
    if (metadata.storagePath !== undefined) delete metadata.storagePath;

    const files = metadata.files.map((file) => {
      // @ts-ignore
      delete file.path;
      return file;
    });

    return reply
      .type('application/json')
      .status(200)
      .send({
        ...metadata,
        files,
      });
  }

  @Route('/:user/:project/upload', 'GET')
  uploadGet(req: StorageDetailRequest, reply: FastifyReply) {
    return reply
      .type('application/json')
      .status(405)
      .send({
        message: `Route /api/v1/storage/${req.params.user}/${req.params.project}/upload only accepts POST requests.`,
      });
  }

  @Route('/:user/:project/upload', 'POST')
  async upload(req: StorageDetailRequest, reply: FastifyReply) {
    if (!req.user)
      return reply.status(403).send({
        message: 'You are not allowed to acces upload resource, please login or create an access token.',
      });

    // TODO: check for permissions
    if (!req.isMultipart())
      return reply.status(415).send({
        message: 'Request was not a multipart upload.',
      });

    const file = await req.file({
      limits: {
        fileSize: 100 * (1024 * 1024), // 100mb is only allowed (maybe TODO - add premium support for ~500mb single file uploads?)
        files: 1, // one one file is allowed
      },
    });

    this.logger.debug(`Uploading file ${file.filename} (field-name: ${file.fieldname})`);
    const buffer = await file.toBuffer();
    await this.storage.handle([
      {
        project: [req.params.user, req.params.project],
        name: file.filename,
        contents: buffer,
        metadata: {
          contentType: file.mimetype,
          size: buffer.length,
        },
      },
    ]);

    return reply.status(204).send();
  }

  @Route('/:user/:project/upload/bulk', 'GET')
  uploadBulkGet(req: StorageDetailRequest, reply: FastifyReply) {
    return reply
      .type('application/json')
      .status(405)
      .send({
        message: `Route /api/v1/storage/${req.params.user}/${req.params.project}/upload/bulk only accepts POST requests.`,
      });
  }

  @Route('/:user/:project/upload/bulk', 'POST')
  async uploadBulk(req: StorageDetailRequest, reply: FastifyReply) {
    if (!req.user)
      return reply.status(403).send({
        message: 'You are not allowed to acces upload resource, please login or create an access token.',
      });

    // TODO: check for permissions
    if (!req.isMultipart())
      return reply.status(415).send({
        message: 'Request was not a multipart upload.',
      });

    let fileToUpload: File[] = [];

    // eslint-disable-next-line
    for await (const file of req.files({ limits: { fileSize: 100 * (1024 * 1024) } })) {
      const contents = await file.toBuffer();

      fileToUpload.push({
        project: [req.params.user, req.params.project],
        name: file.filename,
        contents,
        metadata: {
          contentType: file.mimetype,
          size: Buffer.byteLength(contents),
        },
      });
    }

    await this.storage.handle(fileToUpload);
    return reply.status(204).send();
  }
}
