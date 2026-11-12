// ============================================================
//  PORTA (Door)
//  Una porta che si apre in due modi:
//    - scorrendo (di solito verso l'alto), come una saracinesca;
//    - ruotando sui cardini, come una porta a una o due ante.
//
//  DOVE SI METTE
//    Sul modello della porta, oppure trascina il prefab PF_Kit_Porta (scorre)
//    o PF_Kit_PortaAnte (due ante che ruotano).
//
//  COSA CONFIGURARE (nell'Inspector)
//    Left Hinge / Right Hinge: le ante. Se ne metti almeno una, la porta ruota;
//      se le lasci vuote, la porta scorre come prima.
//    Open Angle: di quanti gradi ruotano le ante (90 = spalancate).
//    Away From Player: spuntato, le ante si aprono dalla parte opposta al giocatore (lo spingono via davanti a se').
//      Togli la spunta per farle aprire sempre dallo stesso lato (Open Angle negativo = l'altro lato).
//    Open Offset: di quanti metri si sposta quando scorre (0, 4.2, 0 = sale di 4,2 m).
//    Speed: quanto e' veloce ad aprirsi.
//    Start Open: spunta se deve partire gia' aperta.
//    Open Clip / Close Clip: i suoni di apertura e chiusura (trascina un file audio).
//
//  COME SI COLLEGA
//    Da un altro oggetto: nella lista di un evento (es. On Placed) premi +,
//    trascina la porta nel riquadro e scegli Door > Open (oppure Close, Toggle).
//
//  ESEMPIO
//    Altare > On Placed > Door.Open: posi l'offerta e la porta si apre.
// ============================================================
using UnityEngine;

/// <summary>Porta che scorre oppure ruota sui cardini quando viene aperta. Collegala a un evento: Door.Open, Door.Close o Door.Toggle.</summary>
public class Door : MonoBehaviour
{
    [Header("Ante (porta girevole)")]
    [Tooltip("Anta sinistra: l'oggetto con il perno sul cardine. Lascia vuoto per una porta che scorre")] public Transform leftHinge;
    [Tooltip("Anta destra: l'oggetto con il perno sul cardine. Lascia vuoto per una porta che scorre")] public Transform rightHinge;
    [Tooltip("Di quanti gradi ruotano le ante quando la porta e' aperta")] public float openAngle = 90f;
    [Tooltip("Se attivo, le ante si aprono dalla parte opposta al giocatore")] public bool awayFromPlayer = true;
    [Tooltip("Il giocatore (facoltativo): se vuoto lo cerca da solo nella scena")] public Transform player;

    [Header("Porta che scorre")]
    [Tooltip("Di quanto si sposta la porta aperta, in metri e nello spazio del mondo")] public Vector3 openOffset = new Vector3(0, 4.2f, 0);

    [Header("Comune")]
    [Tooltip("Velocita' di apertura: metri al secondo se scorre, giri da 90 gradi al secondo se ruota")] public float speed = 2.5f;
    [Tooltip("Se attivo, la porta parte gia' aperta")] public bool startOpen;
    [Tooltip("Suono quando si apre")] public AudioClip openClip;
    [Tooltip("Suono quando si chiude")] public AudioClip closeClip;

    Vector3 closed; Quaternion leftClosed, rightClosed; float angle, leftSign = -1f, rightSign = 1f; bool open;
    public bool IsOpen => open;
    bool Swings => leftHinge != null || rightHinge != null;

    void Awake()
    {
        closed = transform.position;
        if (leftHinge) leftClosed = leftHinge.localRotation;
        if (rightHinge) rightClosed = rightHinge.localRotation;
        open = startOpen;
        if (!open) return;
        if (Swings) { angle = openAngle; ApplyAngle(); } else transform.position = closed + openOffset;
    }

    public void Open()
    {
        if (open) return;
        if (Swings && awayFromPlayer && angle <= 0.01f) ChooseSides();
        open = true; KitAudio.Play(openClip, transform.position);
    }
    public void Close() { if (!open) return; open = false; KitAudio.Play(closeClip, transform.position); }
    public void Toggle() { if (open) Close(); else Open(); }

    void Update()
    {
        if (!Swings) { transform.position = Vector3.MoveTowards(transform.position, closed + (open ? openOffset : Vector3.zero), speed * Time.deltaTime); return; }
        angle = Mathf.MoveTowards(angle, open ? openAngle : 0f, speed * 90f * Time.deltaTime);
        ApplyAngle();
    }

    /// <summary>Per ogni anta sceglie il verso che la allontana dal giocatore: prova i due versi e tiene quello che porta il centro dell'anta piu' lontano da lui.</summary>
    void ChooseSides()
    {
        if (player == null) { var pc = FindFirstObjectByType<PlayerController>(); if (pc) player = pc.transform; else if (Camera.main) player = Camera.main.transform; }
        if (player == null) return;
        Vector3 verso = player.position - transform.position; verso.y = 0;
        if (verso.sqrMagnitude < 1e-6f) return;
        leftSign = Side(leftHinge, verso, leftSign); rightSign = Side(rightHinge, verso, rightSign);
    }

    float Side(Transform hinge, Vector3 verso, float current)
    {
        if (hinge == null) return current;
        var r = hinge.GetComponentInChildren<Renderer>(); if (r == null) return current;
        Vector3 asse = hinge.parent ? hinge.parent.up : Vector3.up, braccio = r.bounds.center - hinge.position;
        float Punteggio(float s) => Vector3.Dot(Quaternion.AngleAxis(s * openAngle, asse) * braccio - braccio, verso);
        return Punteggio(1f) < Punteggio(-1f) ? 1f : -1f;
    }

    /// <summary>Ruota le ante attorno al loro asse verticale, ognuna nel verso scelto all'apertura.</summary>
    void ApplyAngle()
    {
        // l'asse e' la verticale del genitore, anche se il modello importato ha l'anta ruotata
        if (leftHinge) leftHinge.localRotation = Quaternion.Euler(0, leftSign * angle, 0) * leftClosed;
        if (rightHinge) rightHinge.localRotation = Quaternion.Euler(0, rightSign * angle, 0) * rightClosed;
    }
}
