// ============================================================
//  PIASTRA A PRESSIONE (PressurePlate)
//  Scatta quando il giocatore ci sale sopra. Puo' anche essere una trappola.
//
//  DOVE SI METTE
//    Trascina PF_Kit_Piastra (normale) o PF_Kit_PiastraTrappola (trappola).
//
//  COSA CONFIGURARE (nell'Inspector)
//    Mode: Normal scatta una volta; Trap ti riporta all'ultimo Checkpoint ogni volta.
//    Objective: obiettivo da far avanzare (facoltativo).
//    Clip e Vfx: suono ed effetto. Sink Depth: di quanto si abbassa.
//    Solo Trap: Trap Delay (attesa prima di riportarti) e Trap Message.
//
//  COME SI COLLEGA
//    On Pressed: cosa succede quando scatta (es. BrazierSwitch.Light, Door.Open).
//    On Trapped: cosa succede quando una trappola scatta.
//
//  ESEMPIO
//    On Pressed > Braciere > BrazierSwitch.Light: la piastra accende il braciere.
// ============================================================
using System.Collections;
using UnityEngine;
using UnityEngine.Events;

/// <summary>Piastra a pressione. Normale: scatta una volta quando il giocatore ci sale.
/// Trappola: ogni volta che ci sali ti riporta all'ultimo punto di ripartenza (CheckpointZone).</summary>
[RequireComponent(typeof(Collider))]
public class PressurePlate : MonoBehaviour
{
    public enum Mode { Normal, Trap }
    [Tooltip("Normal: scatta una volta. Trap: ti riporta all'ultimo checkpoint ogni volta che ci sali")] public Mode mode;
    [Tooltip("Obiettivo da far avanzare quando viene premuta (facoltativo)")] public Objective objective;
    [Tooltip("Suono quando viene premuta")] public AudioClip clip;
    [Tooltip("Effetto creato quando viene premuta (facoltativo)")] public GameObject vfx;
    [Tooltip("Di quanto si abbassa quando viene premuta (metri)")] public float sinkDepth = 0.05f;
    [Tooltip("Cosa succede quando viene premuta (es. Door.Open)")] public UnityEvent onPressed = new UnityEvent();
    [Tooltip("Solo Trap: attesa prima di riportarti indietro (secondi)")] public float trapDelay = 0.3f;
    [Tooltip("Solo Trap: messaggio (vuoto = quello del GameManager)")] public string trapMessage = "";
    [Tooltip("Solo Trap: cosa succede quando scatta")] public UnityEvent onTrapped = new UnityEvent();

    bool done, springing;
    public bool IsPressed => done;

    void Reset() { GetComponent<Collider>().isTrigger = true; }

    void OnTriggerEnter(Collider other)
    {
        if (!PlayerController.IsPlayer(other)) return;
        if (mode == Mode.Trap) { if (!springing) StartCoroutine(Spring()); return; }
        if (done) return;
        done = true;
        transform.position += Vector3.down * sinkDepth;
        KitAudio.Play(clip, transform.position);
        if (vfx) { var v = Instantiate(vfx, transform.position, Quaternion.identity); Destroy(v, 4f); }
        if (objective) objective.AddProgress();
        onPressed.Invoke();
    }

    IEnumerator Spring()
    {
        springing = true;
        transform.position += Vector3.down * sinkDepth;
        KitAudio.Play(clip, transform.position);
        if (vfx) { var v = Instantiate(vfx, transform.position, Quaternion.identity); Destroy(v, 4f); }
        yield return new WaitForSeconds(trapDelay);
        if (GameManager.Instance) { if (string.IsNullOrEmpty(trapMessage)) GameManager.Instance.Respawn(); else GameManager.Instance.Respawn(trapMessage); }
        onTrapped.Invoke();
        transform.position += Vector3.up * sinkDepth;
        springing = false;
    }

    void OnDrawGizmos() { KitGizmos.DrawZone(GetComponent<Collider>(), new Color(1f, 0.8f, 0.2f, 0.25f)); }
}
