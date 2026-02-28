<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport Quotidien – {{ $date->toDateString() }}</title>
    <style>
        /* ── Base ─────────────────────────────────────────────────────── */
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif;
            font-size: 11px;
            line-height: 1.6;
            color: #1a1520;
            background: #ffffff;
        }

        /* ── Color System (Cabinet Hannit) ────────────────────────────── */
        /* Primary: #c23464  |  Accent: #7600da  |  Secondary: #da0067  */

        /* ── Header ──────────────────────────────────────────────────── */
        .report-header {
            text-align: center;
            padding: 28px 0 20px;
            border-bottom: 4px solid #c23464;
            margin-bottom: 24px;
            position: relative;
        }

        .report-header::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #c23464 0%, #7600da 50%, #da0067 100%);
        }

        .report-header .clinic-name {
            font-size: 12px;
            color: #c23464;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 4px;
            margin-bottom: 6px;
        }

        .report-header h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1a1520;
            margin-bottom: 6px;
        }

        .report-header .report-date {
            font-size: 13px;
            color: #8a8590;
            font-weight: 500;
        }

        .report-header .report-id {
            font-size: 9px;
            color: #b0abb2;
            margin-top: 6px;
            letter-spacing: 1px;
        }

        /* ── Summary Cards ───────────────────────────────────────────── */
        .summary-grid {
            width: 100%;
            border-collapse: separate;
            border-spacing: 10px 0;
            margin-bottom: 28px;
        }

        .summary-grid td {
            width: 33.33%;
            padding: 0;
            vertical-align: top;
        }

        .summary-card {
            background: linear-gradient(145deg, rgba(194, 52, 100, 0.06) 0%, rgba(118, 0, 218, 0.06) 100%);
            border: 1px solid rgba(194, 52, 100, 0.15);
            border-radius: 10px;
            padding: 16px 12px;
            text-align: center;
        }

        .summary-card .card-value {
            font-size: 28px;
            font-weight: 700;
            color: #c23464;
        }

        .summary-card .card-label {
            font-size: 8px;
            color: #8a8590;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-top: 4px;
            font-weight: 600;
        }

        .summary-card.accent .card-value { color: #7600da; }
        .summary-card.accent { border-color: rgba(118, 0, 218, 0.15); }

        .summary-card.secondary .card-value { color: #da0067; }
        .summary-card.secondary { border-color: rgba(218, 0, 103, 0.15); }

        /* ── Section Titles ──────────────────────────────────────────── */
        .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #1a1520;
            padding-bottom: 8px;
            margin: 28px 0 14px;
            border-bottom: 2px solid transparent;
            border-image: linear-gradient(90deg, #c23464, #7600da) 1;
            position: relative;
        }

        .section-title .badge {
            display: inline-block;
            background: linear-gradient(135deg, #c23464, #da0067);
            color: #ffffff;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 10px;
            border-radius: 12px;
            margin-left: 10px;
            vertical-align: middle;
        }

        /* ── Tables ──────────────────────────────────────────────────── */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 18px;
            font-size: 10px;
        }

        .data-table thead th {
            background: linear-gradient(135deg, #c23464, #9e2a52);
            color: #ffffff;
            padding: 10px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .data-table thead th:first-child { border-radius: 6px 0 0 0; }
        .data-table thead th:last-child { border-radius: 0 6px 0 0; }

        .data-table tbody tr:nth-child(even) {
            background: rgba(194, 52, 100, 0.03);
        }

        .data-table tbody tr:hover {
            background: rgba(194, 52, 100, 0.06);
        }

        .data-table tbody td {
            padding: 8px;
            border-bottom: 1px solid #f3f2f5;
            vertical-align: top;
            color: #4a4550;
        }

        /* ── Status Badges ───────────────────────────────────────────── */
        .status {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 8px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-pending {
            background: rgba(245, 158, 11, 0.12);
            color: #b45309;
        }

        .status-confirmed {
            background: rgba(34, 197, 94, 0.12);
            color: #15803d;
        }

        .status-cancelled {
            background: rgba(239, 68, 68, 0.12);
            color: #b91c1c;
        }

        .status-completed {
            background: rgba(118, 0, 218, 0.12);
            color: #7600da;
        }

        .status-read {
            background: rgba(34, 197, 94, 0.12);
            color: #15803d;
        }

        .status-unread {
            background: rgba(194, 52, 100, 0.12);
            color: #c23464;
        }

        .status-replied {
            background: rgba(118, 0, 218, 0.12);
            color: #7600da;
        }

        .status-awaiting {
            background: rgba(245, 158, 11, 0.12);
            color: #b45309;
        }

        /* ── Appointment Status Breakdown ────────────────────────────── */
        .status-breakdown {
            width: 100%;
            border-collapse: separate;
            border-spacing: 8px 0;
            margin-bottom: 18px;
        }

        .status-breakdown td { width: 25%; padding: 0; text-align: center; }

        .status-box {
            border-radius: 8px;
            padding: 10px 6px;
            font-size: 9px;
            font-weight: 600;
        }

        .status-box .count {
            font-size: 22px;
            font-weight: 700;
            display: block;
            margin-bottom: 2px;
        }

        /* ── Empty State ─────────────────────────────────────────────── */
        .empty-state {
            text-align: center;
            padding: 24px;
            color: #b0abb2;
            font-style: italic;
            background: linear-gradient(145deg, rgba(194, 52, 100, 0.03), rgba(118, 0, 218, 0.03));
            border-radius: 8px;
            border: 1px dashed rgba(194, 52, 100, 0.2);
            margin-bottom: 18px;
            font-size: 10px;
        }

        /* ── Footer ──────────────────────────────────────────────────── */
        .report-footer {
            margin-top: 36px;
            padding-top: 16px;
            border-top: 3px solid transparent;
            border-image: linear-gradient(90deg, #c23464, #7600da, #da0067) 1;
            text-align: center;
            font-size: 9px;
            color: #b0abb2;
        }

        .report-footer .brand {
            color: #c23464;
            font-weight: 700;
            font-size: 10px;
            letter-spacing: 1px;
        }

        .report-footer .generated-at { margin-bottom: 4px; }

        /* ── Decorative ──────────────────────────────────────────────── */
        .accent-dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #c23464;
            margin-right: 6px;
            vertical-align: middle;
        }

        .truncate {
            max-width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    </style>
</head>
<body>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- HEADER                                                        -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="report-header">
        <div class="clinic-name">✦ Cabinet Hannit ✦</div>
        <h1>Rapport d'Activité Quotidien</h1>
        <div class="report-date">{{ $date_formatted }}</div>
        <div class="report-id">ID: RPT-{{ $date->format('Ymd') }}-{{ strtoupper(substr(md5($date->toDateString()), 0, 6)) }}</div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- SUMMARY CARDS                                                 -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <table class="summary-grid">
        <tr>
            <td>
                <div class="summary-card">
                    <div class="card-value">{{ $summary['total_appointments'] }}</div>
                    <div class="card-label">Rendez-vous</div>
                </div>
            </td>
            <td>
                <div class="summary-card accent">
                    <div class="card-value">{{ $summary['total_messages'] }}</div>
                    <div class="card-label">Messages</div>
                </div>
            </td>
            <td>
                <div class="summary-card secondary">
                    <div class="card-value">{{ $summary['new_users'] }}</div>
                    <div class="card-label">Nouveaux Utilisateurs</div>
                </div>
            </td>
        </tr>
    </table>

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- APPOINTMENTS SECTION                                          -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="section-title">
        <span class="accent-dot"></span>Rendez-vous
        <span class="badge">{{ $summary['total_appointments'] }}</span>
    </div>

    @if($summary['total_appointments'] > 0)
        <table class="status-breakdown">
            <tr>
                <td>
                    <div class="status-box" style="background: rgba(245, 158, 11, 0.1); color: #b45309;">
                        <span class="count">{{ $summary['pending_appointments'] }}</span>
                        En attente
                    </div>
                </td>
                <td>
                    <div class="status-box" style="background: rgba(34, 197, 94, 0.1); color: #15803d;">
                        <span class="count">{{ $summary['confirmed_appointments'] }}</span>
                        Confirmés
                    </div>
                </td>
                <td>
                    <div class="status-box" style="background: rgba(239, 68, 68, 0.1); color: #b91c1c;">
                        <span class="count">{{ $summary['cancelled_appointments'] }}</span>
                        Annulés
                    </div>
                </td>
                <td>
                    <div class="status-box" style="background: rgba(118, 0, 218, 0.1); color: #7600da;">
                        <span class="count">{{ $summary['completed_appointments'] }}</span>
                        Terminés
                    </div>
                </td>
            </tr>
        </table>

        <table class="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Service</th>
                    <th>Date / Heure</th>
                    <th>Statut</th>
                    <th>Créé à</th>
                </tr>
            </thead>
            <tbody>
                @foreach($appointments as $index => $apt)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td><strong>{{ $apt->name }}</strong></td>
                    <td>{{ $apt->email ?? '—' }}</td>
                    <td>{{ $apt->phone }}</td>
                    <td>{{ $apt->service }}</td>
                    <td>{{ $apt->date }} {{ $apt->time ?? '' }}</td>
                    <td>
                        <span class="status status-{{ $apt->status ?? 'pending' }}">
                            @switch($apt->status ?? 'pending')
                                @case('pending') En attente @break
                                @case('confirmed') Confirmé @break
                                @case('cancelled') Annulé @break
                                @case('completed') Terminé @break
                                @default {{ ucfirst($apt->status) }}
                            @endswitch
                        </span>
                    </td>
                    <td>{{ \Carbon\Carbon::parse($apt->created_at)->format('H:i') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="empty-state">Aucun rendez-vous créé ou mis à jour aujourd'hui.</div>
    @endif

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- MESSAGES SECTION                                              -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="section-title">
        <span class="accent-dot"></span>Messages de Contact
        <span class="badge">{{ $summary['total_messages'] }}</span>
    </div>

    @if($summary['total_messages'] > 0)
        <table class="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Expéditeur</th>
                    <th>Email</th>
                    <th>Sujet</th>
                    <th>État</th>
                    <th>Réponse</th>
                    <th>Créé à</th>
                </tr>
            </thead>
            <tbody>
                @foreach($messages as $index => $msg)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td><strong>{{ $msg->name }}</strong></td>
                    <td>{{ $msg->email }}</td>
                    <td class="truncate">{{ $msg->subject }}</td>
                    <td>
                        <span class="status {{ $msg->is_read ? 'status-read' : 'status-unread' }}">
                            {{ $msg->is_read ? 'Lu' : 'Non lu' }}
                        </span>
                    </td>
                    <td>
                        @if($msg->admin_reply)
                            <span class="status status-replied">Répondu</span>
                        @else
                            <span class="status status-awaiting">En attente</span>
                        @endif
                    </td>
                    <td>{{ \Carbon\Carbon::parse($msg->created_at)->format('H:i') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="empty-state">Aucun message créé ou mis à jour aujourd'hui.</div>
    @endif

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- NEW USERS SECTION                                             -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="section-title">
        <span class="accent-dot"></span>Nouvelles Inscriptions
        <span class="badge">{{ $summary['new_users'] }}</span>
    </div>

    @if($summary['new_users'] > 0)
        <table class="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Méthode</th>
                    <th>Inscrit à</th>
                </tr>
            </thead>
            <tbody>
                @foreach($new_users as $index => $user)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td><strong>{{ $user->name }}</strong></td>
                    <td>{{ $user->email }}</td>
                    <td>{{ ucfirst($user->auth_provider ?? 'email') }}</td>
                    <td>{{ \Carbon\Carbon::parse($user->created_at)->format('H:i') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="empty-state">Aucune nouvelle inscription aujourd'hui.</div>
    @endif

    <!-- ═══════════════════════════════════════════════════════════════ -->
    <!-- FOOTER                                                        -->
    <!-- ═══════════════════════════════════════════════════════════════ -->
    <div class="report-footer">
        <div class="generated-at">
            Généré le {{ now()->format('d/m/Y à H:i:s') }}
        </div>
        <div class="brand">CABINET HANNIT</div>
        <div style="margin-top: 2px;">Rapport confidentiel — Usage interne uniquement</div>
    </div>

</body>
</html>